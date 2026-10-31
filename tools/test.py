"""Headless checks for both builds. Run after `node build.mjs`:

    python3 tools/test.py

Needs Python Playwright with Chromium. Uses fake data and a fake AI service; nothing leaves the machine.
"""
import json, os, sys
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
fails = []


def check(name, ok, extra=""):
    print(("PASS " if ok else "FAIL ") + name + (("  " + str(extra)) if extra and not ok else ""))
    if not ok:
        fails.append(name)


SETUP = r"""
() => {
  const T = te();
  d.compounds = [{id:'c1',name:'HGH / Somatropin',base:'iu',route:'SubQ',color:'#27567F'},{id:'c2',name:'Retatrutide',route:'SubQ',color:'#2C6349'},{id:'c3',name:'DSIP',route:'SubQ',color:'#A8690F'}];
  d.protocols = [
    {id:'p1',compoundId:'c1',dose:2,unit:'iu',route:'SubQ',sched:'daily',split:true,startDate:ne(T,-60),active:true,phases:[]},
    {id:'p2',compoundId:'c2',dose:2,unit:'mg',route:'SubQ',sched:'weekdays',days:[1],startDate:ne(T,-60),active:true,phases:[]}];
  d.batches = [{id:'b1',compoundId:'c2',vialMg:10,sealed:2,startVials:3,openMg:6,bacMl:'2',lot:'KP-0007',status:'open'}];
  d.logs = [];
  for (let i=1;i<=7;i++){ const dt=ne(T,-i);
    d.logs.push({id:'a'+i,protocolId:'p1',compoundId:'c1',date:dt,status:'taken',slot:'am',doseMg:2});
    if (i!==3 && i!==5) d.logs.push({id:'b'+i,protocolId:'p1',compoundId:'c1',date:dt,status:'taken',slot:'pm',doseMg:2});
    if (ee(dt).getDay()===1) d.logs.push({id:'r'+i,protocolId:'p2',compoundId:'c2',date:dt,status:'taken',doseMg:2});
  }
  d.logs.push({id:'x1',protocolId:'p2',compoundId:'c2',date:ne(T,-2),status:'taken',doseMg:2});
  d.logs.push({id:'x2',compoundId:'c3',date:ne(T,-4),status:'taken',doseMg:0.1});
  d.metrics = [[-60,208,5.0],[-45,210,5.2],[-30,212,5.4],[-15,215,5.8],[-13,217,5.8],[-12,219,6.0]].map((x,i)=>({id:'m'+i,date:ne(T,x[0]),weight:x[1],glucose:x[2]}));
  d.settings.trackWeight = true;
  d.labTests = [
    {id:'lab-igf',name:'IGF-1',group:'Hormones',unit:'ug/L',range:'Z -2 to +2',lo:null,hi:250,order:1},
    {id:'lab-t',name:'Testosterone',group:'Hormones',unit:'nmol/L',range:'8.6-29',lo:8.6,hi:29,order:2},
    {id:'lab-a1c',name:'Hemoglobin A1c',group:'Sugar',unit:'%',range:'<6.0',lo:null,hi:6.0,thi:5.6,order:3},
    {id:'lab-alt',name:'ALT',group:'Liver',unit:'U/L',range:'<50',lo:null,hi:50,order:4},
    {id:'lab-glucose-fasting',name:'Glucose, Fasting',group:'Sugar',unit:'mmol/L – mg/dL',range:'3.6-6.0',lo:3.6,hi:6.0,order:5}];
  d.labDraws = [{id:'dr1',date:ne(T,-13),statin:'none',results:{'lab-igf':'292','lab-t':'41','lab-a1c':'5.7','lab-alt':'22','lab-glucose-fasting':'4.6/83'}}];
  d.insights = []; d.insGuides = [];
  d.settings.ai = {url:'https://example.workers.dev',key:'k',context:'On prescribed TRT.'};
  window.__calls = [];
  window.fetch = async (url, opt) => {
    const b = JSON.parse(opt.body); window.__calls.push(b);
    const p = JSON.parse(b.messages[0].content.split('\n\n').slice(1).join('\n\n'));
    const flags = p.must_cover_flags;
    const notes = flags.slice(0, Math.max(0, flags.length-1)).map(f=>({id:f.id, explanation:'Explains '+f.id}));
    const out = b.tools[0].name==='protocol_report'
      ? {rating:'excellent', headline:'H', summary:'S', flag_notes:notes,
         compound_guides:(p.compound_guides_needed||[]).map(g=>({ref:g.ref, expect:'Guide for '+g.compound+' '+g.stage, watch:['w1','w2']})),
         interactions:[], lab_notes:[], recommendations:[]}
      : {rating:'good', headline:'H', summary:'S', flag_notes:notes, findings:[], observations:[], recommendations:[], clinician_questions:[]};
    return new Response(JSON.stringify({model:b.model,stop_reason:'tool_use',content:[{type:'tool_use',input:out}]}),{status:200});
  };
}
"""

TABS = ["instructions", "today", "log", "protocols", "stock", "history", "labs", "insights", "labels", "tools", "library", "weight", "settings"]

def engines(pw):
    """Chromium always; WebKit (the engine behind Safari on iPhone) too when it is installed."""
    out = [("chromium", pw.chromium)]
    try:
        b = pw.webkit.launch()
        b.close()
        out.append(("webkit", pw.webkit))
    except Exception:
        print("\nWebKit (Safari's engine) is not installed here, so only Chromium runs. `python3 -m playwright install webkit` adds it.")
    return out


with sync_playwright() as pw:
  for ENGINE, engine in engines(pw):
    print("\n#### " + ENGINE)
    br = engine.launch()
    for variant in ["personal", "community"]:
        print("\n== " + variant)
        for width, theme in [(1280, "light"), (390, "dark")]:
            pg = br.new_page(viewport={"width": width, "height": 900}, color_scheme=theme)
            errs = []
            pg.on("pageerror", lambda e: errs.append(str(e)))
            pg.route("**/*", lambda r: r.abort() if not r.request.url.startswith("file:") else r.continue_())
            pg.goto("file://" + os.path.join(ROOT, "dist", variant, "index.html"))
            pg.wait_for_timeout(400)
            pg.evaluate(SETUP)
            tag = f"{variant} {width}"
            stamp = pg.evaluate("o")
            check(f"{tag}: stamp says {variant}", stamp.endswith(variant), stamp)
            nav = pg.evaluate("ln().map(x=>x[0])")
            check(f"{tag}: Insights tab only in personal", ("insights" in nav) == (variant == "personal"), nav)
            check(f"{tag}: write-ups are synced and in the empty state", pg.evaluate("SYNC_LISTS.includes('insGuides') && Array.isArray(l().insGuides)"))
            for tab in TABS:
                pg.evaluate(f"r.tab='{tab}'; r.labelId=null; redrawPage()")
                sw = pg.evaluate("document.documentElement.scrollWidth > window.innerWidth + 1")
                check(f"{tag}: {tab} opens with no sideways scroll", not sw)
            # labels: CoA and lot only in personal
            pg.evaluate("r.tab='labels'; redrawPage()")
            has_coa = pg.evaluate("!!document.querySelector('#lf-coa')")
            has_lot = pg.evaluate("!!document.querySelector('#lf-lot')")
            check(f"{tag}: label CoA/lot fields only in personal", (has_coa and has_lot) == (variant == "personal") and (has_coa or has_lot) == (variant == "personal"))
            # Layout panel: personal only; changes save to settings and redraw the label; reset restores
            has_lay = pg.evaluate("!!document.querySelector('#lb-lay')")
            check(f"{tag}: label Layout panel only in personal", has_lay == (variant == "personal"))
            if variant == "personal":
                before = pg.evaluate("document.querySelector('#limg').src")
                check(f"{tag}: layout starts collapsed", pg.evaluate("document.querySelector('#lb-lay').hidden"))
                pg.click("#lb-laytog")
                pg.click("#lb-lay [data-a=bold][data-k=name]")
                pg.click("#lb-lay [data-a=md][data-k=name]")
                pg.click("#lb-lay [data-a=up][data-k=bottom]")
                pg.click("#lb-lay [data-a=hide][data-k='s:small']")
                pg.click("#lb-lay [data-a=qp][data-v=top]")
                pg.wait_for_timeout(50)
                L = pg.evaluate("d.settings.labelLayout")
                ok = L["order"][:2] == ["under", "name"] and L["m"]["name"]["b"] is False and L["m"]["bottom"]["sc"] == 110 and L["sd"]["small"]["h"] and L["qr"]["pos"] == "top"
                check(f"{tag}: layout changes saved", ok, L)
                check(f"{tag}: layout changes redraw the label", pg.evaluate("document.querySelector('#limg').src") != before)
                for _ in range(20): pg.evaluate("(()=>{const b=document.querySelector('#lb-lay [data-a=up][data-k=strength]'); b && !b.disabled && b.click()})()")
                check(f"{tag}: size capped at 160%", pg.evaluate("d.settings.labelLayout.m.strength.sc") == 160)
                # 2 lines on the bottom bar changes the drawing
                b2 = pg.evaluate("document.querySelector('#limg').src")
                pg.click("#lb-lay [data-a=two][data-k=bottom]")
                pg.wait_for_timeout(50)
                check(f"{tag}: 2 lines saved and redraws", pg.evaluate("d.settings.labelLayout.m.bottom.two") is True and pg.evaluate("document.querySelector('#limg').src") != b2)
                # typed wording survives a background redraw (sync) while focus is elsewhere
                pg.fill("#lf-bottom", "Research Use Only")
                pg.evaluate("document.activeElement.blur(); redrawPage(1)")
                check(f"{tag}: unsaved label wording survives a sync redraw", pg.evaluate("document.querySelector('#lf-bottom').value") == "Research Use Only")
                pg.click("#lb-savebatch")
                check(f"{tag}: saving clears the draft", pg.evaluate("!(r.lbDraft||{})[r.labelId] && d.batches[0].label.bottom") == "Research Use Only")
                pg.click("#lb-reset")
                pg.wait_for_timeout(50)
                pg.click("#lb-laytog") if pg.evaluate("document.querySelector('#lb-lay').hidden") else None
                pg.click("#lb-lay [data-a=reset]")
                pg.wait_for_timeout(50)
                check(f"{tag}: reset layout", pg.evaluate("d.settings.labelLayout") is None and pg.evaluate("document.querySelector('#limg').src") == before)
            pg.evaluate("r.tab='labs'; redrawPage(); labDrawForm('dr1')")
            lbl = pg.evaluate("document.querySelector('label[for=ld-st]').textContent")
            check(f"{tag}: draw form medication label", lbl == ("Statin / ezetimibe" if variant == "personal" else "Medications at the time"), lbl)
            pg.evaluate("Rt()")
            if variant == "personal" and width == 1280:
                res = pg.evaluate("""async () => {
                  const T = te(), start = ne(T,-7), end = ne(T,-1);
                  const r1 = await insRunProtocol(start, end);
                  const c1 = window.__calls.length - 1;
                  const r2 = await insRunProtocol(start, end, r1.id);
                  const p1 = JSON.parse(window.__calls[c1].messages[0].content.split('\\n\\n').slice(1).join('\\n\\n'));
                  const p2 = JSON.parse(window.__calls.at(-1).messages[0].content.split('\\n\\n').slice(1).join('\\n\\n'));
                  const L = await insRunLabs('dr1');
                  r.tab='insights'; r.insOpen=r1.id; redrawPage();
                  const txt = document.querySelector('#view').innerText;
                  return {same: JSON.stringify(r1.flags)===JSON.stringify(r2.flags) && r1.rating===r2.rating,
                    need1: p1.compound_guides_needed.length, need2: p2.compound_guides_needed.length,
                    saved: d.insGuides.length, model: window.__calls[c1].model, temp: window.__calls[c1].temperature,
                    sent: p1.must_cover_flags.map(f=>f.id), all: r1.flags.map(f=>f.id+(f.note?'*':'')),
                    guideShown: txt.includes('Guide for HGH / Somatropin early'),
                    fixedShown: txt.includes('All were evening doses.'),
                    missingShown: txt.includes('Claude did not explain this one'),
                    glu: r1.flags.find(f=>f.title==='Home-meter fasting glucose') || null,
                    rating: r1.rating, labRating: L.rating, txt: txt.slice(0, 300)};
                }""")
                check("report twice: same flags and rating", res["same"])
                check("first report asks for 2 write-ups, second for none", res["need1"] == 2 and res["need2"] == 0, res)
                check("write-ups saved once", res["saved"] == 2, res["saved"])
                check("model defaults to Haiku", res["model"] == "claude-haiku-5-5", res["model"])
                check("randomness set to zero", res["temp"] == 0)
                check("routine flags not sent to the AI", all(f.rstrip("*") not in res["sent"] for f in res["all"] if f.endswith("*")) and len(res["sent"]) < len(res["all"]), res)
                check("saved write-up shown on the report", res["guideShown"])
                check("fixed wording shown (evening-dose pattern)", res["fixedShown"])
                check("an unexplained flag is still listed", res["missingShown"])
                check("protocol rating set by the app", res["rating"] == "fair", res["rating"])
                g = res["glu"] or {}
                check("home glucose labelled as home meter and set against the lab result",
                      g.get("sev") == "low" and "lab fasting glucose was 4.6 mmol/L" in g.get("text", "") and "Diabetes" not in g.get("text", "") and g.get("note"), g)
                check("lab rating set by the app", res["labRating"] == "needs_attention", res["labRating"])
            if variant == "personal" and width == 1280:
                sp = pg.evaluate("""() => {
                  const T = te(), F = ne(T, -3);
                  d.protocols = [{id:'ps',compoundId:'c1',dose:1,unit:'iu',route:'SubQ',sched:'daily',split:true,splitFrom:F,startDate:ne(T,-10),active:true,phases:[]}];
                  d.logs = [];
                  for (let i=1;i<=10;i++){ const dt=ne(T,-i);
                    if (dt < F) d.logs.push({id:'o'+i,protocolId:'ps',compoundId:'c1',date:dt,status:'taken',doseMg:1});
                    else { d.logs.push({id:'a'+i,protocolId:'ps',compoundId:'c1',date:dt,status:'taken',slot:'am',doseMg:1});
                           d.logs.push({id:'p'+i,protocolId:'ps',compoundId:'c1',date:dt,status:'taken',slot:'pm',doseMg:1}); } }
                  const S = insStats(ne(T,-10), ne(T,-1));
                  const before = SL(d.protocols[0], ne(F,-1)), after = SL(d.protocols[0], F);
                  r.tab='history'; r.histView='calendar'; r.calDay=ne(F,-1); r.calMonth=null; redrawPage();
                  const dots = document.querySelector('[data-calday="'+ne(F,-1)+'"]').querySelectorAll('.cdot').length;
                  Mn('ps'); const m = Ot('#modal');
                  const shown = m.querySelector('#p-sf').style.display !== 'none' && m.querySelector('#p-splitfrom').value === F;
                  m.querySelector('#p-splitfrom').value = ne(F,-1); m.querySelector('#p-save').click();
                  const saved = d.protocols[0].splitFrom;
                  return {missed: S.rows[0].missed, pct: S.pct, adh: dt(10).pct, before, after, dots, shown, saved, F1: ne(F,-1)};
                }""")
                check("AM + PM start date: no missed PM before it", sp["missed"] == [] and sp["pct"] == 100, sp)
                check("AM + PM start date: one dose before, two from it", sp["before"] == [""] and sp["after"] == ["am", "pm"], sp)
                check("AM + PM start date: calendar shows one dot before it", sp["dots"] == 1, sp)
                check("AM + PM start date: shown and saved in the form", sp["shown"] and sp["saved"] == sp["F1"], sp)
            if variant == "personal" and width == 1280:
                cg = pg.evaluate("""() => {
                  const S0 = '2026-09-01', D = '2026-10-20', E = '2026-10-28';
                  d.compounds.push({id:'ct',name:'Testosterone',route:'SubQ',color:'#93362A'});
                  d.protocols = [{id:'pt',compoundId:'ct',dose:50,unit:'mg',route:'SubQ',sched:'weekdays',days:[2,5],startDate:S0,active:true,phases:[]}];
                  d.logs = [];
                  for (let x = S0; x <= E; x = ne(x, 1)) { const w = ee(x).getDay();
                    if (x < D ? w === 2 : (w === 2 || w === 5)) d.logs.push({id:'t'+x,protocolId:'pt',compoundId:'ct',date:x,status:'taken',doseMg:x < D ? 100 : 50}); }
                  Mn('pt'); const m = Ot('#modal');
                  const esc = m.querySelector('#p-esc'); esc.checked = true; esc.dispatchEvent(new Event('change'));
                  m.querySelector('[data-esc="date"]').click();
                  m.querySelector('#p-chgdate').value = D; m.querySelector('#p-chgok').click();
                  const rows = m.querySelectorAll('#p-escbox .phrow');
                  rows[0].querySelector('.ph-d').value = '100'; rows[0].querySelector('.ph-d').dispatchEvent(new Event('input'));
                  rows[0].querySelector('[data-pd="0,5"]').click();
                  m.querySelector('#p-save').click();
                  const p = d.protocols[0], S = insStats(S0, E);
                  return {n: rows.length, ph: p.phases.map(x=>[x.dose, x.dur, x.durUnit, x.ps, (x.pdays||[]).join('')]),
                    missed: S.rows[0].missed, pct: S.pct, before: Ge(p,'2026-10-13').dose, after: Ge(p,'2026-10-23').dose,
                    friBefore: Ye(p,'2026-10-16'), friAfter: Ye(p,'2026-10-23'), tueBefore: Ye(p,'2026-10-13'), open: !Ot('#scrim').hidden};
                }""")
                check("Change on a date: two phases split at the date", cg["n"] == 2 and cg["ph"][0][1] == 49 and cg["ph"][0][2] == "days", cg)
                check("Change on a date: old dose before, new dose after", cg["before"] == 100 and cg["after"] == 50, cg)
                check("Change on a date: no missed Fridays before the change", cg["missed"] == [] and cg["pct"] == 100 and not cg["friBefore"] and cg["friAfter"] and cg["tueBefore"], cg)
                check("Change on a date: form saved and closed", not cg["open"], cg)
            if width == 1280:
                # b77: sync record is compressed, then encrypted; old records (no z) still read
                cz = pg.evaluate("""async () => {
                  const big = JSON.parse(JSON.stringify(d));
                  for (let i = 0; i < 3000; i++) big.logs.push({id:'g'+i, protocolId:'p1', compoundId:'c1', date:ne(te(),-(i%400)), status:'taken', slot:i%2?'am':'pm', doseMg:2, site:'abd-l-in', _m:Date.now()});
                  for (let i = 0; i < 10; i++) big.insights.push({id:'ri'+i, kind:'protocol', created:i, ai:{summary:'Lorem ipsum dolor sit amet. '.repeat(200)}});
                  const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
                  const plain = JSON.stringify(big).length;
                  const e1 = await packRecord(big, 'correct horse'), r1 = await unpackRecord(e1, 'correct horse');
                  const e2 = await packRecord(big, ''), r2 = await unpackRecord(e2, '');
                  const old1 = await unpackRecord({enc:0, body:JSON.stringify(big)}, '');
                  const salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
                  const k = await keyFromPassphrase('correct horse', salt);
                  const ct = await crypto.subtle.encrypt({name:'AES-GCM', iv}, k, new TextEncoder().encode(JSON.stringify(big)));
                  const old2 = await unpackRecord({enc:1, salt:toBase64(salt), iv:toBase64(iv), body:toBase64(new Uint8Array(ct))}, 'correct horse');
                  return {z1:e1.z, z2:e2.z, ok1:eq(r1,big), ok2:eq(r2,big), old1:eq(old1,big), old2:eq(old2,big),
                          plain, packed:e1.body.length, oldPacked:toBase64(new Uint8Array(ct)).length};
                }""")
                check(f"{tag}: sync record compressed and encrypted, reads back exactly", cz["z1"] == 1 and cz["ok1"], cz)
                check(f"{tag}: sync record compressed without a passphrase, reads back exactly", cz["z2"] == 1 and cz["ok2"], cz)
                check(f"{tag}: records written before b77 still read", cz["old1"] and cz["old2"], cz)
                check(f"{tag}: compressed record under a quarter of the old size", cz["packed"] < cz["oldPacked"] / 4, cz)
                print(f"     size: {cz['oldPacked']//1024} KB before b77 -> {cz['packed']//1024} KB")
                # b77: settings merge one by one
                sm = pg.evaluate("""() => {
                  const a = mergeSettings({x:1, y:1, _m:100, _mk:{x:100, y:50}}, {x:2, y:2, _m:120, _mk:{x:60, y:120}});
                  const b = mergeSettings({x:1, y:1, _m:100, _mk:{x:100, y:50}}, {x:2, y:2, _m:200});
                  const c = mergeSettings({x:1, y:1, _m:300}, {x:2, z:9, _m:200, _mk:{x:200, z:200}});
                  rememberSeen(); const before = JSON.stringify(d.settings._mk || {});
                  d.settings.trackWeight = false; stampChanges();
                  const mk = d.settings._mk;
                  d.settings.trackWeight = true; stampChanges();
                  return {a:[a.x, a.y], b:[b.x, b.y], c:[c.x, c.y, c.z], stamped: Object.keys(mk).filter(k => !JSON.parse(before)[k] || JSON.parse(before)[k] !== mk[k])};
                }""")
                check(f"{tag}: settings changed on two devices both kept", sm["a"] == [1, 2], sm)
                check(f"{tag}: settings from a pre-b77 copy merge as before", sm["b"] == [2, 2] and sm["c"] == [1, 1, 9], sm)
                check(f"{tag}: only the changed setting gets a new time", sm["stamped"] == ["trackWeight"], sm)
                # b77: a sync that brings nothing new is recognised; one that does is not
                ng = pg.evaluate("""() => { const c = JSON.parse(JSON.stringify(d)); const g = contentSignature(d);
                  const same = contentSignature(mergeData(d, c)) === g; c.logs.push({id:'new1', compoundId:'c1', date:te(), status:'taken', _m:Date.now()+1e4});
                  return {same, changed: contentSignature(mergeData(d, c)) !== g}; }""")
                check(f"{tag}: sync with nothing new is told apart from one with changes", ng["same"] and ng["changed"], ng)
                # b77: typed-but-unsaved boxes survive a background redraw; fresh data is not overwritten
                ur = pg.evaluate("""() => {
                  const mk = (v) => Bt('<div><input id="ua" value="' + v + '"><input name="nb" value="n"><select id="us"><option>A</option><option>B</option></select><input type="checkbox" id="uc"></div>');
                  const r1 = mk('saved'); r1.querySelector('#ua').value = 'typed'; r1.querySelector('[name=nb]').value = 'typed2';
                  r1.querySelector('#us').value = 'B'; r1.querySelector('#uc').checked = true;
                  const k = findUnsaved(r1);
                  const same = mk('saved'); restoreUnsaved(same, k);
                  const fresh = mk('from other device'); restoreUnsaved(fresh, k);
                  const clean = findUnsaved(mk('saved')).length;
                  return {n:k.length, same:[same.querySelector('#ua').value, same.querySelector('[name=nb]').value, same.querySelector('#us').value, same.querySelector('#uc').checked],
                          fresh: fresh.querySelector('#ua').value, clean};
                }""")
                check(f"{tag}: untouched page has nothing to keep", ur["clean"] == 0, ur)
                check(f"{tag}: typed boxes, lists and ticks put back after a redraw", ur["n"] == 4 and ur["same"] == ["typed", "typed2", "B", True], ur)
                check(f"{tag}: box changed by the other device is not overwritten", ur["fresh"] == "from other device", ur)
                pg.evaluate("r.tab='tools'; redrawPage()")
                pg.fill("#a-dose", "7.5")
                pg.evaluate("document.activeElement && document.activeElement.blur(); redrawPage(1)")
                check(f"{tag}: real page keeps a typed box through a sync redraw", pg.evaluate("document.querySelector('#a-dose').value") == "7.5")
                dl = pg.evaluate("delete d._del.__settings; rememberSeen(); stampChanges(); d.settings.theme = 'dark'; stampChanges(); '__settings' in d._del")
                check(f"{tag}: saving no longer writes a fake settings deletion", dl is False, dl)
                # b77: Insights keeps the newest 10 of each kind
                if variant == "personal":
                    ic = pg.evaluate("""() => { d.insights = [];
                      for (let i = 0; i < 12; i++) d.insights.push({id:'p'+i, kind:'protocol', created:i});
                      d.insights.push({id:'L0', kind:'lab', created:0});
                      insSave({id:'p12', kind:'protocol', created:12});
                      const p = d.insights.filter(x=>x.kind==='protocol').map(x=>x.created);
                      return {n:p.length, min:Math.min(...p), max:Math.max(...p), lab:d.insights.some(x=>x.id==='L0')}; }""")
                    check(f"{tag}: Insights keeps the newest 10 of each kind", ic == {"n": 10, "min": 3, "max": 12, "lab": True}, ic)
            if width == 1280:
                # b78: absorption model
                pk = pg.evaluate("""() => {
                  const ke = Math.LN2/165, ka = absorbRate(ke, 48); let best = 0, bh = 0;
                  for (let h = 0; h <= 200; h += 0.1) { const v = fractionInBody(ke, ka, h); if (v > best) { best = v; bh = h; } }
                  const flip = absorbRate(Math.LN2/4, 30); let b2 = 0, h2 = 0;
                  for (let h = 0; h <= 200; h += 0.1) { const v = fractionInBody(Math.LN2/4, flip, h); if (v > b2) { b2 = v; h2 = h; } }
                  return {bh, h2, start: fractionInBody(ke, ka, 0), iv: fractionInBody(ke, Infinity, 0), peak: best,
                    sema: timeToPeak({name:'Semaglutide', route:'SubQ'}), wegovy: timeToPeak({name:'Wegovy', route:'SubQ'}).src, reta: timeToPeak({name:'Retatrutide', route:'SubQ'}),
                    bpc: timeToPeak({name:'BPC-157', route:'SubQ'}).h, own: timeToPeak({name:'Semaglutide', tPeak:'12'}), oral: timeToPeak({name:'X', route:'Oral'}).h};
                }""")
                check(f"{tag}: dose peaks at its time to peak (48 h)", abs(pk["bh"] - 48) < 0.3, pk)
                check(f"{tag}: slow absorption (peak later than 1/ke) solved too", abs(pk["h2"] - 30) < 0.3, pk)
                check(f"{tag}: nothing in the body at the moment of the shot; IV is instant", pk["start"] == 0 and pk["iv"] == 1, pk)
                check(f"{tag}: semaglutide uses the published peak time", pk["sema"]["h"] == 48 and pk["sema"]["src"] == "published", pk)
                check(f"{tag}: retatrutide marked as a rough guess (no published peak time)", pk["reta"]["src"] == "rough" and pk["reta"]["h"] == 24, pk)
                check(f"{tag}: short-acting SubQ peptide gets a short rough peak time", pk["bpc"] == 0.5, pk)
                check(f"{tag}: your own peak time wins", pk["own"]["h"] == 12 and pk["own"]["src"] == "yours", pk)
                # b78: cached estimate matches a full recount, updates after a save, and the Today page is quick
                ca = pg.evaluate("""() => {
                  const keep = d.logs.slice(), T = Date.now();
                  for (let i = 0; i < 3000; i++) d.logs.push({id:'z'+i, compoundId:'c2', date:ne(te(),-(i%300)), status:'taken', doseMg:1, route:'SubQ'});
                  s();
                  const c = Ce('c2'), ke = Math.LN2/halfLifeOf(c), ka = absorbRate(ke, timeToPeak(c,'SubQ').h); let ref = 0;
                  for (const g of d.logs) { if (g.compoundId !== 'c2' || g.status !== 'taken') continue;
                    const t0 = new Date(g.at || g.date+'T12:00').getTime(); if (t0 <= T) ref += be(g.doseMg)*fractionInBody(ke, ka, (T-t0)/36e5); }
                  const v = levelAt('c2', T);
                  r.tab = 'today'; const t1 = performance.now(); redrawPage(); const ms = performance.now() - t1;
                  d.logs.push({id:'zz', compoundId:'c2', date:te(), at:new Date(T-36e5*24).toISOString(), status:'taken', doseMg:5, route:'SubQ'}); s();
                  const v2 = levelAt('c2', T);
                  d.logs = keep; s();
                  return {rel: Math.abs(v-ref)/ref, ms, grew: v2 > v + 3};
                }""")
                check(f"{tag}: cached level matches a full recount", ca["rel"] < 1e-6, ca)
                check(f"{tag}: level updates after a new shot is saved", ca["grew"], ca)
                check(f"{tag}: Today page draws in under 1 s with 3,000 shots", ca["ms"] < 1000, ca)
                print(f"     Today page with 3,000 shots: {ca['ms']:.0f} ms")
                # b78: compound form has Time to peak, and it saves
                tp = pg.evaluate("""() => { $a('c2'); const m = Ot('#modal'); const f = m.querySelector('#c-tp');
                  const ph = f.placeholder, hint = f.parentNode.querySelector('.hint').textContent;
                  f.value = '30'; m.querySelector('#c-save').click(); const saved = Ce('c2').tPeak, src = timeToPeak(Ce('c2')).src;
                  Ce('c2').tPeak = ''; s(); return {ph, hint, saved, src}; }""")
                check(f"{tag}: compound form shows and saves Time to peak", tp["ph"] == "24" and "rough" in tp["hint"] and tp["saved"] == "30" and tp["src"] == "yours", tp)
            if width == 1280:
                # b79: protocol form keeps a draft again (b78 broke it by reusing the name DS)
                dr = pg.evaluate("""async () => { localStorage.removeItem('protocol:draft'); Mn();
                  const m = Ot('#modal'), n = m.querySelector('#p-name'); n.value = 'Draft check'; n.dispatchEvent(new Event('input', {bubbles:true}));
                  await new Promise(r => setTimeout(r, 400)); const v = localStorage.getItem('protocol:draft'); Rt(); localStorage.removeItem('protocol:draft');
                  return v ? JSON.parse(v).name : null; }""")
                check(f"{tag}: protocol form saves a draft as you type", dr == "Draft check", dr)
                # b79: daily copies on this device
                sn = pg.evaluate("""async () => {
                  await new Promise((res) => { const q = indexedDB.deleteDatabase(SNAP_DB); q.onsuccess = q.onerror = q.onblocked = res; });
                  await snapDaily(); await snapDaily();
                  const one = (await snapList()).filter(x => x.kind === 'daily').length;
                  for (let i = 1; i <= 16; i++) await snapReq('readwrite', st => st.put({id:'daily-old'+i, kind:'daily', at:i, date:'2026-01-'+String(i).padStart(2,'0'), counts:{}, z:0, body:'{}'}));
                  await snapPrune();
                  const list = await snapList(), dailies = list.filter(x => x.kind === 'daily');
                  const todayKept = dailies.some(x => x.date === te());
                  // restore: change things after the copy, then put the copy back
                  const copyId = dailies.find(x => x.date === te()).id;
                  const before = {logs: d.logs.length, protos: d.protocols.map(p=>p.id).sort().join()};
                  d.logs.push({id:'after1', compoundId:'c2', date:te(), status:'taken', doseMg:9}); const gone = d.protocols.pop(); s();
                  d.settings.sync = {enabled:true, email:'keep@me', auto:true}; s();
                  rememberSeen();
                  const ok = await snapRestore(copyId);
                  const now = Date.now();
                  const after = {logs: d.logs.length, protos: d.protocols.map(p=>p.id).sort().join()};
                  stampChanges();
                  return {one, nDaily: dailies.length, todayKept, ok, same: JSON.stringify(before) === JSON.stringify(after),
                    stamped: d.protocols.every(p => now - p._m < 5000), deleted: !!d._del['after1'], back: !d._del[gone.id],
                    syncKept: d.settings.sync.email === 'keep@me', beforeCopy: (await snapList()).some(x => x.kind === 'before' && /before restoring/.test(x.why)),
                    panel: (r.tab = 'settings', redrawPage(), await new Promise(r => setTimeout(r, 300)), document.querySelectorAll('#snap-list [data-snap]').length)};
                }""")
                check(f"{tag}: one daily copy per day", sn["one"] == 1, sn)
                check(f"{tag}: 14 daily copies kept, today's among them", sn["nDaily"] == 14 and sn["todayKept"], sn)
                check(f"{tag}: restoring puts the copy back", sn["ok"] and sn["same"], sn)
                check(f"{tag}: restored items win the next sync; later additions are deleted everywhere", sn["stamped"] and sn["deleted"] and sn["back"], sn)
                check(f"{tag}: restore keeps this device's sync sign-in and keeps a copy first", sn["syncKept"] and sn["beforeCopy"], sn)
                check(f"{tag}: Settings lists the copies", sn["panel"] >= 14, sn)
                # b79: which app this is
                ak = pg.evaluate("""() => { r.tab = 'settings'; redrawPage(); return {brand: (document.querySelector('.brand .appkind')||{}).textContent,
                  line: (document.querySelector('#view .appkind-line')||{}).textContent || '', title: document.title}; }""")
                want = "Personal" if variant == "personal" else "Community"
                check(f"{tag}: side menu and Settings say this is the {want} app", ak["brand"] == want and want in ak["line"] and ak["title"].endswith(want), ak)
                # b79: old deletion markers are dropped after 90 days, "__" keys always
                tb = pg.evaluate("""() => { const old = Date.now() - 91*864e5, recent = Date.now() - 5*864e5;
                  const a = JSON.parse(JSON.stringify(d)); a._del = {gone_old: old, gone_new: recent, __settings: recent};
                  const m = mergeData(a, {_del: {}}); return Object.keys(m._del).sort(); }""")
                check(f"{tag}: deletion markers older than 90 days dropped", tb == ["gone_new"], tb)
                # b79: two devices syncing at once: the cloud copy ends up with both devices' changes
                tx = pg.evaluate("""async () => {
                  localStorage.setItem('protocol:pass', 'correct horse battery');
                  d.settings.sync = {enabled:true, email:'t@t', auto:false};
                  const store = {data:null, ver:0}; let tries = 0, other = null;
                  fb = {instance:{}, db:{}, authI:{currentUser:{uid:'u1'}}, auth:{}, fs:{
                    doc: () => 'logs/u1',
                    getDoc: async () => ({exists: () => !!store.data, data: () => store.data}),
                    setDoc: async (_, v) => { store.data = v; store.ver++; },
                    runTransaction: async (_, fn) => {
                      for (;;) { tries++; const v0 = store.ver; let w = null;
                        const out = await fn({get: async () => ({exists: () => !!store.data, data: () => store.data}), set: (_, v) => { w = v; }});
                        if (tries === 1) { store.data = other; store.ver++; }   // the other device writes in between
                        if (store.ver !== v0) continue;                        // Firestore would retry
                        store.data = w; store.ver++; return out; } } }};
                  const o = JSON.parse(JSON.stringify(d)); o.logs.push({id:'other1', compoundId:'c2', date:te(), status:'taken', doseMg:1, _m: Date.now()});
                  other = await packRecord(o, 'correct horse battery');
                  d.logs.push({id:'mine1', compoundId:'c2', date:te(), status:'taken', doseMg:2}); stampChanges();
                  await syncNow(true);
                  const cloud = await unpackRecord(store.data, 'correct horse battery');
                  const ids = cloud.logs.map(x => x.id);
                  fb = null; d.settings.sync = {enabled:false}; localStorage.removeItem('protocol:pass');
                  return {tries, both: ids.includes('other1') && ids.includes('mine1'), local: d.logs.some(x => x.id === 'other1'), state: syncState.status, msg: syncState.msg};
                }""")
                check(f"{tag}: two devices syncing at once keep both changes", tx["tries"] == 2 and tx["both"] and tx["local"] and tx["state"] == "ok", tx)
            check(f"{tag}: no page errors", not errs, errs)
            pg.close()
    br.close()

html = {v: open(os.path.join(ROOT, "dist", v, "index.html"), encoding="utf-8").read() for v in ["personal", "community"]}
check("QR library only in personal", ("qrcode-generator" in html["personal"]) and ("qrcode-generator" not in html["community"]))
check("analytics tag only in community", ("cloudflareinsights" in html["community"]) and ("cloudflareinsights" not in html["personal"]))
# b80: the product boundary. Personal-only features must not be in the community file at all
# (not just hidden), and must still be in the personal file.
PERSONAL_ONLY = {
    "label CoA/QR address field": 'id="lf-coa"',
    "QR address box": "QR address for Niimbot",
    "label layout editor": "lb-laytog",
    "Insights tab code": "function insView",
    "Insights access key field": "ins-key",
    "Insights AI request header": "X-App-Key",
    "Insights AI Worker hint": "protocol-ai",
    "statin wording on draws": "Statin / ezetimibe",
}
for what, marker in PERSONAL_ONLY.items():
    check(f"separation: {what} in personal only", marker in html["personal"] and marker not in html["community"], marker)
COMMUNITY_ONLY = {"medications wording on draws": "Medications at the time", "community title": "<title>Protocol — Community</title>"}
for what, marker in COMMUNITY_ONLY.items():
    check(f"separation: {what} in community only", marker in html["community"] and marker not in html["personal"], marker)
check("separation: no korahpeptides.com address is needed by either file",
      all("korahpeptides.com/" not in h.replace("coa.korahpeptides.com/", "") for h in html.values()))
check("copyright notice kept in both", all(h.count("© 2026 Korah Peptides") >= 3 for h in html.values()))
check("label QR library bundled, not loaded from the internet", "cdnjs" not in html["personal"] and "var qrcode" in html["personal"].replace("var qrcode=", "var qrcode"))
check("password never saved on the device", all('setItem("protocol:pw"' not in h for h in html.values()))
check("page titles name the app", "<title>Protocol — Personal</title>" in html["personal"] and "<title>Protocol — Community</title>" in html["community"])
check("passphrase required on both builds", all("encryption, required" in h and "Leave blank to store it unencrypted" not in h and "Repeat passphrase" in h for h in html.values()))

# b77: offline. Serve each build from a local web address, let the offline copy install, go offline, reopen.
import threading, http.server, functools
with sync_playwright() as pw:
    br = pw.chromium.launch()
    for variant in ["personal", "community"]:
        H = functools.partial(http.server.SimpleHTTPRequestHandler, directory=os.path.join(ROOT, "dist", variant))
        H.log_message = lambda *a: None
        srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), H)
        threading.Thread(target=srv.serve_forever, daemon=True).start()
        url = f"http://127.0.0.1:{srv.server_address[1]}/"
        ctx = br.new_context()
        ctx.route("**/*", lambda r: r.continue_() if r.request.url.startswith("http://127.0.0.1") else r.abort())
        pg = ctx.new_page()
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(url)
        ready = pg.evaluate("Promise.race([navigator.serviceWorker.ready.then(()=>true), new Promise(r=>setTimeout(()=>r(false), 8000))])")
        pg.reload(); pg.wait_for_timeout(300)
        check(f"{variant}: offline copy installs", ready and pg.evaluate("!!navigator.serviceWorker.controller"))
        ctx.set_offline(True)
        pg.reload(); pg.wait_for_timeout(500)
        opened = pg.evaluate("document.querySelector('#view') && document.querySelector('#view').children.length > 0 && typeof o === 'string' && o.endsWith('" + variant + "')")
        check(f"{variant}: app opens with no connection", opened)
        if variant == "personal":
            check("personal: label QR works with no connection", pg.evaluate("typeof qrcode === 'function' && !!qrcode(0,'Q')"))
        check(f"{variant}: no page errors offline", not errs, errs)
        ctx.close(); srv.shutdown()
    br.close()
print("\n" + ("ALL PASSED" if not fails else f"{len(fails)} FAILED: " + ", ".join(fails)))
sys.exit(1 if fails else 0)
