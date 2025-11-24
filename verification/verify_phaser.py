from playwright.sync_api import sync_playwright

def verify_phaser_game():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            # Go to the local dev server
            page.goto("http://localhost:5173")

            # Wait for Phaser to load (canvas element)
            page.wait_for_selector("canvas", timeout=10000)

            # Wait a bit for the scene to render (sky blue background)
            page.wait_for_timeout(2000)

            # Take a screenshot
            page.screenshot(path="verification/phaser_game.png")
            print("Screenshot taken: verification/phaser_game.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_phaser_game()
