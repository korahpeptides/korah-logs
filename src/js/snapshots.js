/*! © 2026 Korah Peptides. All rights reserved. */
// b79: daily copies of the data, kept on this device only (IndexedDB "korah-snapshots", never synced).
//
// - A "daily" copy is taken the first time the app opens (or comes back to the screen) on a new day.
//   The newest SNAP_KEEP_DAILY are kept.
// - A "before" copy is taken just before anything that replaces data wholesale: restoring a copy,
//   importing a backup, erasing everything. The newest SNAP_KEEP_BEFORE are kept.
// - Each copy is the whole data object, gzip-compressed when the browser can (about 30 KB each).
// - Restoring stamps every restored item as just changed, so it wins over the cloud copy on the next
//   sync, and anything added since the copy is deleted on every device (that is what restoring means).
//   The sync sign-in settings on this device are kept as they are.
var SNAP_DB = "korah-snapshots",
  SNAP_KEEP_DAILY = 14,
  SNAP_KEEP_BEFORE = 5;

function snapOpen() {
  return new Promise(function (resolve, reject) {
    if (typeof indexedDB === "undefined") return reject(new Error("This browser cannot keep copies."));
    var q = indexedDB.open(SNAP_DB, 1);
    q.onupgradeneeded = function () {
      q.result.createObjectStore("snaps", { keyPath: "id" });
    };
    q.onsuccess = function () {
      resolve(q.result);
    };
    q.onerror = function () {
      reject(q.error || new Error("Could not open the copies store."));
    };
  });
}
// one request in one transaction; resolves with the request's result
function snapReq(mode, make) {
  return snapOpen().then(function (db) {
    return new Promise(function (resolve, reject) {
      var tx = db.transaction("snaps", mode),
        q = make(tx.objectStore("snaps")),
        out;
      q.onsuccess = function () {
        out = q.result;
      };
      tx.oncomplete = function () {
        db.close();
        resolve(out);
      };
      tx.onerror = tx.onabort = function () {
        db.close();
        reject(tx.error || new Error("Could not use the copies store."));
      };
    });
  });
}
function snapCounts(data) {
  return {
    shots: (data.logs || []).filter(function (x) {
      return x && x.status === "taken";
    }).length,
    protocols: (data.protocols || []).length,
    draws: (data.labDraws || []).length,
  };
}
// all copies, newest first, without their contents
function snapList() {
  return snapReq("readonly", function (st) {
    return st.getAll();
  }).then(function (all) {
    return (all || [])
      .map(function (x) {
        return { id: x.id, kind: x.kind, at: x.at, date: x.date, why: x.why || "", counts: x.counts || {} };
      })
      .sort(function (a, b) {
        return b.at - a.at;
      });
  });
}
async function snapTake(kind, why) {
  var json = JSON.stringify(d),
    z = await gzip(json),
    at = Date.now(),
    rec = {
      id: kind + "-" + at,
      kind: kind,
      at: at,
      date: te(),
      why: why || "",
      counts: snapCounts(d),
      z: z ? 1 : 0,
      body: z || json,
    };
  await snapReq("readwrite", function (st) {
    return st.put(rec);
  });
  await snapPrune();
  return rec.id;
}
async function snapPrune() {
  var list = await snapList(),
    seen = { daily: 0, before: 0 },
    drop = list.filter(function (x) {
      var k = x.kind === "daily" ? "daily" : "before";
      seen[k]++;
      return seen[k] > (k === "daily" ? SNAP_KEEP_DAILY : SNAP_KEEP_BEFORE);
    });
  for (var i = 0; i < drop.length; i++)
    await snapReq("readwrite", function (st) {
      return st.delete(drop[i].id);
    });
}
// take today's daily copy if there isn't one yet; quiet on failure
var snapBusy = false;
async function snapDaily() {
  if (snapBusy) return;
  snapBusy = true;
  try {
    var today = te(),
      list = await snapList();
    var has = list.some(function (x) {
      return x.kind === "daily" && x.date === today;
    });
    var empty = !(d.compounds || []).length && !(d.logs || []).length && !(d.labDraws || []).length;
    if (!has && !empty) await snapTake("daily", "");
  } catch (e) {
  } finally {
    snapBusy = false;
  }
}
// copy taken before a wholesale change; returns false (and says so) if it could not be taken
async function snapBefore(why) {
  try {
    await snapTake("before", why);
    return true;
  } catch (e) {
    return confirm("A safety copy could not be taken first (" + (e.message || e) + "). Go ahead anyway?");
  }
}
async function snapRestore(id) {
  var rec = await snapReq("readonly", function (st) {
    return st.get(id);
  });
  if (!rec) throw new Error("That copy is gone.");
  var snap = JSON.parse(rec.z ? await gunzip(rec.body) : rec.body);
  if (!snap || !Array.isArray(snap.compounds)) throw new Error("That copy could not be read.");
  if (!(await snapBefore("before restoring the copy from " + de(rec.date)))) return false;
  var now = Date.now(),
    keepSync = d.settings && d.settings.sync,
    nd = Object.assign(l(), snap);
  nd.settings = Object.assign(l().settings, snap.settings || {});
  keepSync && (nd.settings.sync = keepSync);
  nd._del = Object.assign({}, d._del || {});
  for (var i = 0; i < SYNC_LISTS.length; i++) {
    var list = nd[SYNC_LISTS[i]] || [];
    for (var j = 0; j < list.length; j++)
      if (list[j] && list[j].id) {
        list[j]._m = now;
        delete nd._del[list[j].id];
      }
  }
  nd.settings._m = now;
  nd.settings._mk = {};
  for (var k in nd.settings) k !== "_m" && k !== "_mk" && (nd.settings._mk[k] = now);
  d = nd;
  s();
  return true;
}

function fmtDay(t) {
  return t.getFullYear() + "-" + String(t.getMonth() + 1).padStart(2, "0") + "-" + String(t.getDate()).padStart(2, "0");
}

// Settings panel
function snapPanel() {
  var p = Bt(
    '<div class="panel" id="snap-panel"><h2>Daily copies on this device</h2><div class="pbody">' +
      '<p class="tiny muted" style="margin:0 0 12px">The app keeps a copy of everything each day you open it (the last ' +
      SNAP_KEEP_DAILY +
      " days), and another just before a restore, an import or Erase everything. " +
      "Copies stay on this device and are not synced. Restoring puts that day back on every synced device, and anything added since is removed, so a copy of how things are now is taken first.</p>" +
      '<div id="snap-list" class="tiny muted">Loading…</div>' +
      '<div class="row" style="margin-top:12px"><button class="btn ghost" id="snap-now">Keep a copy now</button></div>' +
      "</div></div>",
  );
  function fill() {
    var box = p.querySelector("#snap-list");
    snapList()
      .then(function (list) {
        if (!list.length) {
          box.innerHTML = "No copies yet. The first one is taken today.";
          return;
        }
        box.className = "";
        box.innerHTML = list
          .map(function (x) {
            var c = x.counts || {},
              t = new Date(x.at),
              when = de(fmtDay(t)) + " · " + String(t.getHours()).padStart(2, "0") + ":" + String(t.getMinutes()).padStart(2, "0"),
              label = x.kind === "daily" ? "Daily copy" : x.why ? "Copy " + x.why : "Copy";
            return (
              '<div class="listrow" style="align-items:center"><span><span class="lname">' +
              Ht(when) +
              '</span><span class="lmeta">' +
              Ht(label) +
              " · " +
              (c.shots || 0) +
              " shots · " +
              (c.protocols || 0) +
              " protocols · " +
              (c.draws || 0) +
              ' lab draws</span></span><span class="lright"><button class="btn ghost sm" data-snap="' +
              Ht(x.id) +
              '">Restore</button></span></div>'
            );
          })
          .join("");
        box.querySelectorAll("[data-snap]").forEach(function (b) {
          b.addEventListener("click", async function () {
            if (
              !confirm(
                "Put back this copy? Everything added or changed since then is replaced on this device and, after the next sync, on your other devices too. A copy of how things are now is kept first, so you can undo this.",
              )
            )
              return;
            try {
              if (await snapRestore(b.dataset.snap)) {
                redrawPage();
                toast("Copy restored.");
              }
            } catch (e) {
              toast(e.message || "Could not restore it.");
            }
          });
        });
      })
      .catch(function (e) {
        box.textContent = "Copies are not available in this browser (" + (e.message || e) + ").";
      });
  }
  p.querySelector("#snap-now").addEventListener("click", async function () {
    try {
      await snapTake("before", "kept by you");
      toast("Copy kept.");
      fill();
    } catch (e) {
      toast(e.message || "Could not keep a copy.");
    }
  });
  fill();
  return p;
}
