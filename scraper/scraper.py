# scraper/scraper.py

import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from webdriver_manager.chrome import ChromeDriverManager
import csv
import time

def scrape_tcgplayer(card_name):
    options = webdriver.ChromeOptions()
    options.headless = False
    options.binary_location = "/usr/bin/google-chrome"  # Adjust path as needed
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

    url = f'https://www.tcgplayer.com/search/all/product?q={card_name}&view=grid'
    driver.get(url)
    driver.implicitly_wait(10)

    try:
        WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, '.search-result__product')))
    except Exception as e:
        print("Error: ", e)
        driver.quit()
        return []

    cards = []
    while True:
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        items = soup.select('.search-result__product')
        for item in items:
            try:
                name = item.select_one('.search-result__title').text.strip()
                price = item.select_one('.inventory__price-with-shipping').text.strip()
                image_url = item.select_one('.product-card__image img')['src']
                foil_status = "Non-Foil"
                set_name = item.select_one('.product-card__set-name__variant').text.strip()
                cards.append({
                    'name': name,
                    'price': price,
                    'image_url': image_url,
                    'foil_status': foil_status,
                    'set_name': set_name
                })
            except Exception as e:
                print(f"Error extracting data from item: {e}")

        driver.execute_script("window.scrollBy(0, 500);")
        time.sleep(2)
        if not driver.execute_script("return (window.innerHeight + window.scrollY) < document.body.scrollHeight"):
            break

    driver.quit()
    return cards

def save_to_csv(cards, filename='cards.csv'):
    keys = cards[0].keys() if cards else ['name', 'price', 'image_url', 'foil_status', 'set_name']
    with open(filename, 'w', newline='', encoding='utf-8') as output_file:
        dict_writer = csv.DictWriter(output_file, fieldnames=keys)
        dict_writer.writeheader()
        dict_writer.writerows(cards)
