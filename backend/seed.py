"""
SoleSearch — seed script
Populates the database with ~20 real shoes to get the catalogue running.

Usage:
  pip install psycopg2-binary python-dotenv
  python seed.py

Expects a .env file with:
  DATABASE_URL=postgresql://postgres:password@localhost:5432/solesearch
"""

import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/solesearch")

# ─── Seed data ────────────────────────────────────────────────────────────────
# Format: (slug, name, brand_slug, category_slug, subcategory, year, msrp,
#          tagline, score_core, score_comfort, score_durability, score_performance, score_value,
#          weight_g, heel_drop_mm, heel_stack_mm, forefoot_stack_mm,
#          midsole_hardness_hc, energy_return_pct,
#          toebox_width_mm, breathability_score, outsole_grip_score,
#          fit_arch_support, fit_width_options, fit_orthotic_friendly,
#          upper, midsole, outsole,
#          best_for, terrain, review_pros, review_cons)

BRANDS = [
    ("nike",          "Nike",          "US"),
    ("asics",         "ASICS",         "JP"),
    ("brooks",        "Brooks",        "US"),
    ("saucony",       "Saucony",       "US"),
    ("new-balance",   "New Balance",   "US"),
    ("hoka",          "Hoka",          "FR"),
    ("on",            "On",            "CH"),
    ("adidas",        "Adidas",        "DE"),
    ("salomon",       "Salomon",       "FR"),
    ("merrell",       "Merrell",       "US"),
    ("altra",         "Altra",         "US"),
    ("mizuno",        "Mizuno",        "JP"),
    ("under-armour",  "Under Armour",  "US"),
    ("puma",          "Puma",          "DE"),
    ("reebok",        "Reebok",        "US"),
]

SHOES = [
    # Road running
    {
        "slug": "nike-pegasus-41", "name": "Pegasus 41", "brand": "nike",
        "category": "road-running", "subcategory": "Daily Trainer",
        "year": 2024, "msrp": 130.00,
        "tagline": "The workhorse, reimagined.",
        "scores": (88, 91, 84, 87, 82),
        "lab": (284, 10.0, 33.0, 23.0, 28.0, 64.0, 92.0, 74, 81),
        "fit": ("neutral", ["D", "2E"], True),
        "build": ("Flyknit mesh", "React X foam + Zoom Air", "Waffle rubber"),
        "best_for": ["Daily training", "Long runs", "High-mileage weeks"],
        "terrain": ["road", "treadmill"],
        "pros": ["Comfortable out of the box", "Responsive React X foam", "Wide toebox"],
        "cons": ["Heavier than rivals", "Weak grip on wet roads"],
    },
    {
        "slug": "asics-gel-nimbus-26", "name": "Gel-Nimbus 26", "brand": "asics",
        "category": "road-running", "subcategory": "Max Cushion",
        "year": 2024, "msrp": 160.00,
        "tagline": "The pinnacle of comfort.",
        "scores": (89, 94, 86, 85, 79),
        "lab": (295, 10.0, 40.0, 28.0, 22.0, 58.0, 95.0, 71, 78),
        "fit": ("neutral", ["B", "D", "2E"], True),
        "build": ("Engineered mesh", "FF Blast+ foam + Gel", "AHAR rubber"),
        "best_for": ["Long slow runs", "Recovery runs", "High body weight runners"],
        "terrain": ["road"],
        "pros": ["Best-in-class cushioning", "Durable outsole", "Wide fit options"],
        "cons": ["Heavy", "Expensive", "Less responsive feel"],
    },
    {
        "slug": "brooks-ghost-16", "name": "Ghost 16", "brand": "brooks",
        "category": "road-running", "subcategory": "Daily Trainer",
        "year": 2024, "msrp": 140.00,
        "tagline": "Versatile. Reliable. Ready.",
        "scores": (85, 88, 90, 82, 85),
        "lab": (268, 12.0, 36.0, 24.0, 30.0, 61.0, 94.0, 78, 82),
        "fit": ("neutral", ["B", "D", "2E", "4E"], True),
        "build": ("Engineered Air mesh", "DNA Loft v3 foam", "Blown rubber"),
        "best_for": ["Beginners", "Daily training", "Versatile use"],
        "terrain": ["road", "treadmill", "light-trail"],
        "pros": ["True to size", "Excellent durability", "Wide width range"],
        "cons": ["Not the most responsive", "Bulkier feel"],
    },
    {
        "slug": "saucony-ride-17", "name": "Ride 17", "brand": "saucony",
        "category": "road-running", "subcategory": "Daily Trainer",
        "year": 2024, "msrp": 140.00,
        "tagline": "Smooth from start to finish.",
        "scores": (86, 87, 85, 88, 83),
        "lab": (256, 8.0, 34.0, 22.0, 29.0, 67.0, 91.0, 80, 79),
        "fit": ("neutral", ["D", "2E"], True),
        "build": ("FORMFIT engineered mesh", "PWRRUN+ foam", "XT-900 carbon rubber"),
        "best_for": ["Speed workouts", "Daily training", "Lighter runners"],
        "terrain": ["road"],
        "pros": ["Lightweight feel", "Responsive PWRRUN+ foam", "Breathable upper"],
        "cons": ["Less cushioning than rivals", "Narrow fit"],
    },
    {
        "slug": "new-balance-880v14", "name": "880 v14", "brand": "new-balance",
        "category": "road-running", "subcategory": "Daily Trainer",
        "year": 2024, "msrp": 135.00,
        "tagline": "Built for the long haul.",
        "scores": (87, 88, 88, 85, 86),
        "lab": (280, 10.0, 33.0, 23.0, 31.0, 62.0, 93.0, 76, 83),
        "fit": ("neutral", ["B", "D", "2E", "4E"], True),
        "build": ("Engineered mesh", "Fresh Foam X", "Blown rubber"),
        "best_for": ["High-mileage weeks", "Easy runs", "Wide-foot runners"],
        "terrain": ["road"],
        "pros": ["Roomy toe box", "Well-cushioned", "Durable"],
        "cons": ["Heavier feel", "Slightly stiff at first"],
    },
    {
        "slug": "hoka-clifton-9", "name": "Clifton 9", "brand": "hoka",
        "category": "road-running", "subcategory": "Max Cushion",
        "year": 2024, "msrp": 145.00,
        "tagline": "More of what you love.",
        "scores": (90, 93, 83, 86, 84),
        "lab": (246, 5.0, 36.0, 29.0, 20.0, 60.0, 96.0, 79, 76),
        "fit": ("neutral", ["B", "D", "2E"], False),
        "build": ("Open engineered mesh", "EVA foam", "Rubber outsole"),
        "best_for": ["Recovery runs", "All-day wear", "New runners"],
        "terrain": ["road", "treadmill"],
        "pros": ["Ultra-cushioned", "Lightweight for the stack", "Rocker geometry"],
        "cons": ["Low energy return", "Not for speed work"],
    },
    # Trail running
    {
        "slug": "salomon-speedcross-6", "name": "Speedcross 6", "brand": "salomon",
        "category": "trail-running", "subcategory": "Aggressive Trail",
        "year": 2023, "msrp": 140.00,
        "tagline": "Grip. Control. Speed.",
        "scores": (88, 84, 91, 90, 85),
        "lab": (310, 10.0, 29.0, 19.0, 38.0, 54.0, 103.0, 65, 96),
        "fit": ("neutral", ["D"], False),
        "build": ("Sensifit mesh", "EnergyCell foam", "Chevron lugs"),
        "best_for": ["Muddy trails", "Soft terrain", "Trail racing"],
        "terrain": ["trail", "mud", "soft-ground"],
        "pros": ["Best mud grip available", "Precise fit", "Protective"],
        "cons": ["Stiff on roads", "Narrow fit", "Heavy"],
    },
    {
        "slug": "hoka-speedgoat-5", "name": "Speedgoat 5", "brand": "hoka",
        "category": "trail-running", "subcategory": "Max Cushion Trail",
        "year": 2023, "msrp": 155.00,
        "tagline": "Conquer any mountain.",
        "scores": (87, 90, 88, 87, 82),
        "lab": (298, 4.0, 32.0, 28.0, 25.0, 56.0, 100.0, 68, 90),
        "fit": ("neutral", ["D", "2E"], False),
        "build": ("Engineered mesh", "CMEVA foam", "Vibram Megagrip"),
        "best_for": ["Long mountain runs", "Technical terrain", "Ultras"],
        "terrain": ["trail", "mountain", "technical"],
        "pros": ["Vibram Megagrip is exceptional", "Cushioned for long days", "Protective"],
        "cons": ["Heavy", "Wide platform feel", "Not for flat/fast trails"],
    },
    # Sneakers
    {
        "slug": "adidas-samba-og", "name": "Samba OG", "brand": "adidas",
        "category": "sneakers", "subcategory": "Heritage",
        "year": 2024, "msrp": 100.00,
        "tagline": "A classic, forever.",
        "scores": (84, 78, 80, 70, 88),
        "lab": (330, 5.0, 18.0, 13.0, 45.0, 40.0, 88.0, 55, 72),
        "fit": ("neutral", ["D"], False),
        "build": ("Leather upper", "EVA midsole", "Gum rubber outsole"),
        "best_for": ["Casual wear", "Street style", "Light activity"],
        "terrain": ["street"],
        "pros": ["Iconic style", "Durable leather", "Versatile colourways"],
        "cons": ["Minimal cushioning", "Narrow fit", "Not for running"],
    },
    {
        "slug": "new-balance-990v6", "name": "990 v6", "brand": "new-balance",
        "category": "sneakers", "subcategory": "Premium Lifestyle",
        "year": 2024, "msrp": 200.00,
        "tagline": "Made in USA. Built to last.",
        "scores": (86, 85, 92, 75, 78),
        "lab": (370, 8.0, 22.0, 16.0, 38.0, 52.0, 96.0, 68, 80),
        "fit": ("neutral", ["D", "2E", "4E"], True),
        "build": ("Suede/mesh upper", "ENCAP midsole", "Carbon rubber outsole"),
        "best_for": ["All-day wear", "Travel", "Wide feet"],
        "terrain": ["street"],
        "pros": ["Exceptional build quality", "All-day comfort", "Wide widths available"],
        "cons": ["Expensive", "Heavy for a sneaker", "Dad-shoe aesthetic"],
    },
    # Basketball
    {
        "slug": "nike-lebron-21", "name": "LeBron 21", "brand": "nike",
        "category": "basketball", "subcategory": "Performance",
        "year": 2024, "msrp": 200.00,
        "tagline": "Power. Precision. Control.",
        "scores": (87, 85, 88, 90, 75),
        "lab": (460, 0.0, 32.0, 28.0, 35.0, 65.0, 108.0, 55, 88),
        "fit": ("neutral", ["D", "2E"], False),
        "build": ("Woven Interlace upper", "Air Max cushioning", "Multidirectional traction"),
        "best_for": ["Power players", "Indoor court", "High-impact play"],
        "terrain": ["court"],
        "pros": ["Excellent ankle support", "Responsive cushioning", "Durable"],
        "cons": ["Very heavy", "Stiff break-in", "Expensive"],
    },
    # Hiking
    {
        "slug": "salomon-x-ultra-4", "name": "X Ultra 4 GTX", "brand": "salomon",
        "category": "hiking", "subcategory": "Day Hiking",
        "year": 2023, "msrp": 165.00,
        "tagline": "Go anywhere. Confidently.",
        "scores": (89, 86, 90, 88, 83),
        "lab": (360, 11.0, 28.0, 17.0, 40.0, 50.0, 98.0, 62, 91),
        "fit": ("neutral", ["D"], False),
        "build": ("Textile + synthetic upper", "Ortholite footbed", "Contagrip TA outsole"),
        "best_for": ["Day hikes", "Multi-day trips", "Wet conditions"],
        "terrain": ["trail", "mountain", "wet-ground"],
        "pros": ["Gore-Tex waterproofing", "Excellent grip", "Supportive"],
        "cons": ["Needs break-in", "Heavy for speed hiking", "Not breathable in heat"],
    },
    # Walking
    {
        "slug": "hoka-bondi-8", "name": "Bondi 8", "brand": "hoka",
        "category": "walking", "subcategory": "Max Cushion",
        "year": 2023, "msrp": 165.00,
        "tagline": "The most cushioned shoe we make.",
        "scores": (88, 95, 82, 80, 82),
        "lab": (294, 4.0, 39.0, 33.0, 18.0, 58.0, 99.0, 72, 74),
        "fit": ("neutral", ["B", "D", "2E"], False),
        "build": ("Engineered mesh", "Full-length EVA", "Rubber outsole"),
        "best_for": ["All-day standing", "Recovery", "Nurses / healthcare workers"],
        "terrain": ["road", "street"],
        "pros": ["Maximum cushioning", "Wide toe box", "Great for plantar fasciitis"],
        "cons": ["Very chunky look", "Minimal ground feel", "Low durability"],
    },
    # Gym
    {
        "slug": "nike-metcon-9", "name": "Metcon 9", "brand": "nike",
        "category": "gym-training", "subcategory": "Cross-Training",
        "year": 2024, "msrp": 130.00,
        "tagline": "Built for the hardest workouts.",
        "scores": (86, 82, 89, 88, 84),
        "lab": (328, 4.0, 20.0, 18.0, 48.0, 44.0, 90.0, 70, 85),
        "fit": ("neutral", ["D", "2E"], False),
        "build": ("Flat knit upper", "Hyperlift heel insert", "Rubber pods"),
        "best_for": ["Weightlifting", "HIIT", "Rope climbs", "Cross-training"],
        "terrain": ["gym"],
        "pros": ["Stable for lifting", "Durable", "Versatile"],
        "cons": ["Uncomfortable for running", "Stiff feel", "Bulky"],
    },
    # Work & safety
    {
        "slug": "keen-utility-pittsburgh", "name": "Pittsburgh 6\"", "brand": "new-balance",
        "category": "work-safety", "subcategory": "Steel Toe",
        "year": 2023, "msrp": 160.00,
        "tagline": "Protection without compromise.",
        "scores": (83, 81, 92, 78, 84),
        "lab": (620, 15.0, 26.0, 14.0, 50.0, 38.0, 102.0, 55, 88),
        "fit": ("neutral", ["D", "2E"], True),
        "build": ("Leather upper", "PU midsole", "Oil/slip resistant outsole"),
        "best_for": ["Construction", "Warehouse", "All-day standing on hard surfaces"],
        "terrain": ["work-floor"],
        "pros": ["ASTM F2413 certified", "Comfortable for all-day wear", "Durable"],
        "cons": ["Very heavy", "Takes weeks to break in", "Not breathable"],
    },
]


def seed():
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    print("Seeding brands...")
    for slug, name, country in BRANDS:
        cur.execute("""
            INSERT INTO brands (slug, name, country)
            VALUES (%s, %s, %s)
            ON CONFLICT (slug) DO NOTHING
        """, (slug, name, country))

    print(f"Seeding {len(SHOES)} shoes...")
    for s in SHOES:
        # Get brand_id and category_id
        cur.execute("SELECT id FROM brands WHERE slug = %s", (s["brand"],))
        brand_row = cur.fetchone()
        if not brand_row:
            print(f"  ⚠ Brand not found: {s['brand']} — skipping {s['slug']}")
            continue

        cur.execute("SELECT id FROM categories WHERE slug = %s", (s["category"],))
        cat_row = cur.fetchone()
        if not cat_row:
            print(f"  ⚠ Category not found: {s['category']} — skipping {s['slug']}")
            continue

        shoe_id = None
        cur.execute("""
            INSERT INTO shoes (
                slug, name, brand_id, category_id, subcategory, year, msrp, tagline,
                score_core, score_comfort, score_durability, score_performance, score_value,
                fit_arch_support, fit_width_options, fit_orthotic_friendly,
                upper, midsole, outsole,
                best_for, terrain, review_pros, review_cons
            ) VALUES (
                %s,%s,%s,%s,%s,%s,%s,%s,
                %s,%s,%s,%s,%s,
                %s,%s,%s,
                %s,%s,%s,
                %s,%s,%s,%s
            )
            ON CONFLICT (slug) DO UPDATE SET updated_at = now()
            RETURNING id
        """, (
            s["slug"], s["name"], brand_row[0], cat_row[0],
            s["subcategory"], s["year"], s["msrp"], s["tagline"],
            *s["scores"],
            s["fit"][0], s["fit"][1], s["fit"][2],
            s["build"][0], s["build"][1], s["build"][2],
            s["best_for"], s["terrain"], s["pros"], s["cons"],
        ))
        shoe_id = cur.fetchone()[0]

        # Insert lab data
        lab = s["lab"]
        cur.execute("""
            INSERT INTO lab_data (
                shoe_id, source, weight_g,
                heel_drop_mm, heel_stack_mm, forefoot_stack_mm,
                midsole_hardness_hc, energy_return_pct,
                toebox_width_mm, breathability_score, outsole_grip_score
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT DO NOTHING
        """, (shoe_id, "SoleSearch Community", *lab))

        print(f"  ✓ {s['brand'].upper()} {s['name']}")

    conn.commit()
    cur.close()
    conn.close()
    print(f"\n✅ Done! {len(SHOES)} shoes seeded.")


if __name__ == "__main__":
    seed()
