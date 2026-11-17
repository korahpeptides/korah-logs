"""Headless checks for the Weight page charts (hover values, full-screen view). Run after `node build.mjs`."""
import os, sys
from playwright.sync_api import sync_playwright
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SETUP="""() => { const T=todayIso(); appData.settings.trackWeight=true;
 appData.metrics=[];
 for(let i=0;i<20;i++){ appData.metrics.push({id:'m'+i,date:addDays(T,-(60-i*3)),weight:String(250-i*2.1),bf:String(21-i*.15),sbp:String(124-(i%5)),glucose:String(5+(i%4)*.1)}); } }"""
fails=[]
def check(n,ok,x=""):
    print(("PASS " if ok else "FAIL ")+n+("  "+str(x) if not ok else "")); 
    if not ok: fails.append(n)
with sync_playwright() as pw:
    br=pw.chromium.launch()
    for variant in ["personal","community"]:
      for w,theme in [(1280,"light"),(390,"dark")]:
        pg=br.new_page(viewport={"width":w,"height":800},color_scheme=theme)
        errs=[]; pg.on("pageerror",lambda e:errs.append(str(e)))
        pg.route("**/*",lambda r:r.abort() if not r.request.url.startswith("file:") else r.continue_())
        pg.goto("file://"+ROOT+"/dist/"+variant+"/index.html"); pg.wait_for_timeout(400)
        pg.evaluate(SETUP); pg.evaluate("ui.tab='weight'; redrawPage()")
        tag=f"{variant} {w}"
        cards=pg.locator(".metric-card")
        check(tag+": 4 chart cards (weight, bf, sbp, glucose)", cards.count()==4, cards.count())
        # hover on small chart
        wrap=cards.first.locator(".spark-wrap"); bb=wrap.bounding_box()
        pg.mouse.move(bb["x"]+bb["width"]*0.5, bb["y"]+bb["height"]*0.5)
        pg.wait_for_timeout(100)
        tip=cards.first.locator(".chart-tip")
        check(tag+": mini hover shows tip", tip.is_visible())
        txt=tip.inner_text(); check(tag+": mini tip has value+unit+date", "lb" in txt and "20" in txt, txt)
        tb=tip.bounding_box(); cb=cards.first.bounding_box()
        check(tag+": mini tip inside card", tb["x"]>=cb["x"]-1 and tb["x"]+tb["width"]<=cb["x"]+cb["width"]+1, (tb,cb))
        pg.mouse.move(5,5); pg.wait_for_timeout(100)
        check(tag+": tip hides on leave", not tip.is_visible())
        # first/last point hover
        pg.mouse.move(bb["x"]+1, bb["y"]+bb["height"]/2); pg.wait_for_timeout(100)
        t1=tip.inner_text(); pg.mouse.move(bb["x"]+bb["width"]-1, bb["y"]+bb["height"]/2); pg.wait_for_timeout(100)
        t2=tip.inner_text(); check(tag+": ends give first/last readings", "250" in t1 and "210" in t2, (t1,t2))
        # open full screen
        cards.first.click(); pg.wait_for_timeout(150)
        ov=pg.locator(".mfull"); check(tag+": click opens full screen", ov.count()==1)
        ob=ov.bounding_box(); check(tag+": covers viewport", ob["width"]>=w-1 and ob["height"]>=799, ob)
        ch=pg.locator(".mfull-chart svg"); cbb=ch.bounding_box()
        check(tag+": chart fills area", cbb["width"]>w*0.8 and cbb["height"]>300, cbb)
        pg.mouse.move(cbb["x"]+cbb["width"]*0.6, cbb["y"]+cbb["height"]*0.5); pg.wait_for_timeout(100)
        ft=pg.locator(".mfull-chart .chart-tip"); check(tag+": full hover tip visible", ft.is_visible())
        ftx=ft.inner_text(); check(tag+": full tip text", "lb" in ftx and "since" in ftx, ftx)
        fb=ft.bounding_box(); check(tag+": full tip inside viewport", fb["x"]>=0 and fb["x"]+fb["width"]<=w and fb["y"]>=0, fb)
        check(tag+": crosshair+dot shown", pg.locator(".mfull-chart .hd").get_attribute("visibility")=="visible")
        pg.screenshot(path=f"/tmp/korah_full_{variant}_{w}.png")
        # resize redraw
        pg.set_viewport_size({"width":w,"height":600}); pg.wait_for_timeout(150)
        check(tag+": redraws on resize", pg.locator(".mfull-chart svg").bounding_box()["height"]<500)
        pg.keyboard.press("Escape"); pg.wait_for_timeout(100)
        check(tag+": Escape closes", pg.locator(".mfull").count()==0)
        # keyboard open + X close
        cards.nth(1).focus(); pg.keyboard.press("Enter"); pg.wait_for_timeout(100)
        check(tag+": Enter opens", pg.locator(".mfull").count()==1 and "Body fat" in pg.locator(".mfull h2").inner_text())
        pg.locator(".mfull .x").click(); check(tag+": X closes", pg.locator(".mfull").count()==0)
        check(tag+": still on weight page, no sideways scroll", not pg.evaluate("document.documentElement.scrollWidth>window.innerWidth+1"))
        check(tag+": no page errors", not errs, errs)
        pg.close()
    br.close()
print("FAILS:",fails); sys.exit(1 if fails else 0)
