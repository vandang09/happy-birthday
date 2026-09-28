# Happy Birthday

A small Flask-powered birthday experience with a welcome screen, personal message, photo gallery, memory timeline, interactive cake, gift reveal, and optional background music. There is no database or frontend framework.

## Project structure

```text
happy-birthday/
├── app.py
├── requirements.txt
├── README.md
├── templates/
│   └── index.html
└── static/
	├── css/
	│   └── style.css
	├── js/
	│   └── script.js
	├── images/
	│   ├── photo1.jpg
	│   ├── photo2.jpg
	│   ├── photo3.jpg
	│   ├── photo4.jpg
	│   ├── photo5.jpg
	│   └── photo6.jpg
	└── music/
		└── birthday.mp3
```

The six image files and the MP3 are optional. Add your own photos using the names above and add `birthday.mp3` to `static/music/`. Until photos are added, the gallery displays illustrated fallbacks. Music is only requested after the visitor presses the music button.

## Personalize

Edit `BIRTHDAY_CONFIG` near the top of `app.py` to change the recipient's name, date, message, timeline entries, photo filenames, and captions. No other code needs to change for the text and timeline.

## Install and run

Create a virtual environment:

```powershell
python -m venv venv
```

Activate it on Windows:

```powershell
venv\Scripts\activate
```

On Linux or macOS, activate it with:

```sh
source venv/bin/activate
```

Install Flask and start the site:

```sh
pip install -r requirements.txt
python app.py
```

Open [http://127.0.0.1:5000](http://127.0.0.1:5000) in your browser. Google Fonts are optional; system serif and sans-serif fonts are used if the font service is unavailable.