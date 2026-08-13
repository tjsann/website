from pathlib import Path
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

root = Path(__file__).resolve().parent
out = root / "verification"
out.mkdir(exist_ok=True)

for name, width, height, ua in (
    ("iphone", 390, 844, "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1"),
    ("android", 412, 915, "Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 Chrome/139.0 Mobile Safari/537.36"),
):
    options = webdriver.ChromeOptions()
    options.add_argument("--headless=new")
    options.add_experimental_option("mobileEmulation", {
        "deviceMetrics": {"width": width, "height": height, "pixelRatio": 3},
        "userAgent": ua,
    })
    driver = webdriver.Chrome(options=options)
    try:
        driver.get(root.joinpath("index.html").as_uri())
        WebDriverWait(driver, 5).until(EC.element_to_be_clickable((By.ID, "admitButton")))
        metrics = driver.execute_script("return {sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,h:innerHeight}")
        assert metrics["sw"] == metrics["cw"], f"horizontal overflow: {metrics}"
        driver.save_screenshot(str(out / f"{name}-initial.png"))
        driver.find_element(By.ID, "admitButton").click()
        WebDriverWait(driver, 5).until(EC.visibility_of_element_located((By.ID, "confirmSheet")))
        driver.save_screenshot(str(out / f"{name}-confirm.png"))
        driver.find_element(By.ID, "confirmButton").click()
        WebDriverWait(driver, 5).until(EC.visibility_of_element_located((By.ID, "enteredPanel")))
        driver.save_screenshot(str(out / f"{name}-entered.png"))
        print(name, metrics, "OK")
    finally:
        driver.quit()
