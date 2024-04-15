const EMOTION_MAP = {
    "positive": [
        { "admiration": "👏" },
        { "amusement": "😂" },
        { "approval": "👍" },
        { "caring": "🤗" },
        { "desire": "😍" },
        { "excitement": "🤩" },
        { "gratitude": "🙏" },
        { "joy": "😃" },
        { "love": "❤️" },
        { "optimism": "🤞" },
        { "pride": "😌" },
        { "relief": "😅" },
    ],
    "negative": [
        { "anger": "😡" },
        { "annoyance": "😒" },
        { "disappointment": "😞" },
        { "disapproval": "👎" },
        { "disgust": "🤮" },
        { "embarrassment": "😳" },
        { "fear": "😨" },
        { "grief": "😢" },
        { "nervousness": "😬" },
        { "remorse": "😞" },
        { "sadness": "😭" }
    ],
    "neutral": [
        { "confusion": "😕" },
        { "curiosity": "🤔" },
        { "realization": "💡" },
        { "surprise": "😲" },
        { "neutral": "😐" }
    ]
}

const BASE_COLORS = {
    "positive": "#00FF00",
    "negative": "#FF0000",
    "neutral": "#0000FF"
}

export { EMOTION_MAP, BASE_COLORS };