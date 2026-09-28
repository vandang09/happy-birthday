from flask import Flask, render_template

app = Flask(__name__)

# Personalize the celebration here. Gallery images and music are optional files
# in static/images/ and static/music/; the page remains usable without them.
BIRTHDAY_CONFIG = {
    "name": "Luna",
    "date": "September 28",
    "message": (
        "May this next trip around the sun bring you slow mornings, loud laughter, "
        "people who feel like home, and all the little things that make life lovely. "
        "You deserve to be celebrated today and every day."
    ),
    "timeline": [
        {
            "icon": "✿",
            "title": "The day our story began",
            "date": "A little while ago",
            "description": "Some of the best things begin with an ordinary hello.",
        },
        {
            "icon": "☼",
            "title": "A day worth keeping",
            "date": "One sunny afternoon",
            "description": "The kind of memory that still makes us smile when it comes back.",
        },
        {
            "icon": "♡",
            "title": "All the little in-betweens",
            "date": "Every day since",
            "description": "Coffee, conversations, and a hundred small reasons to be grateful.",
        },
        {
            "icon": "✦",
            "title": "A brand-new chapter",
            "date": "Today",
            "description": "Here is to everything beautiful that is still waiting for you.",
        },
        {
            "icon": "∞",
            "title": "More memories to come",
            "date": "Always",
            "description": "The very best parts of your story are still being written.",
        },
    ],
    "gallery": [
        {"file": "photo1.jpg", "caption": "A little moment of sunshine"},
        {"file": "photo2.jpg", "caption": "The best kind of company"},
        {"file": "photo3.jpg", "caption": "Somewhere worth remembering"},
        {"file": "photo4.jpg", "caption": "A day that felt like magic"},
        {"file": "photo5.jpg", "caption": "One for the memory book"},
        {"file": "photo6.jpg", "caption": "More good days, please"},
    ],
}


@app.route("/")
def index():
    return render_template("index.html", birthday=BIRTHDAY_CONFIG)


if __name__ == "__main__":
    app.run(host='127.0.0.1',port=8888, debug=True)
