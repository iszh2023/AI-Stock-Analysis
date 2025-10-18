import tkinter as tk
from tkinter import ttk
import itertools, random, re, math
from collections import defaultdict

# ---------- Optional Pillow (crisp dots / GIF / masking). Falls back cleanly if missing ----------
try:
    from PIL import Image, ImageDraw, ImageTk, Image as PILImage
    PIL_OK = True
except Exception:
    PIL_OK = False


# ===================== THEME HELPERS =====================
def hex_to_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))

name="MathAI"
print (f"Hello, my name is {name}. I'm here to help! If you're using Replit, simply open VNC; if you're using your local IDE, just run the code and a new window should appear. (If that doesn't work, try installing an extension to help)")

def rgb_to_hex(r, g, b):
    r = max(0, min(255, r))
    g = max(0, min(255, g))
    b = max(0, min(255, b))
    return "#{:02x}{:02x}{:02x}".format(r, g, b)


def lerp(a, b, t): return int(a + (b - a) * t)


def lerp_hex(c1, c2, t):
    r1, g1, b1 = hex_to_rgb(c1)
    r2, g2, b2 = hex_to_rgb(c2)
    return rgb_to_hex(lerp(r1, r2, t), lerp(g1, g2, t), lerp(b1, b2, t))


def darken(c, amt=0.15):
    r, g, b = hex_to_rgb(c)
    return rgb_to_hex(int(r * (1 - amt)), int(g * (1 - amt)), int(b * (1 - amt)))


# ---- 20+ themes (incl. black/white/gray variants) ----
PALETTES = {
    "Ocean (Blue/White)": {"bg": "#fbfdff", "fg": "#0f172a", "card": "#ffffff", "border": "#dbeafe",
                           "header": "#1e3a8a", "accent": "#2563eb", "muted": "#475569", "decor": "#60a5fa"},
    "Crimson (Red/Black)": {"bg": "#0a0a0a", "fg": "#f8fafc", "card": "#121212", "border": "#7f1d1d",
                            "header": "#991b1b", "accent": "#dc2626", "muted": "#9ca3af", "decor": "#ef4444"},
    "Slate": {"bg": "#f8fafc", "fg": "#0f172a", "card": "#ffffff", "border": "#e2e8f0", "header": "#0f172a",
              "accent": "#334155", "muted": "#475569", "decor": "#94a3b8"},
    "Graphite": {"bg": "#111827", "fg": "#e5e7eb", "card": "#0b1220", "border": "#1f2937", "header": "#111827",
                 "accent": "#374151", "muted": "#9ca3af", "decor": "#6b7280"},
    "Monochrome": {"bg": "#ffffff", "fg": "#111827", "card": "#ffffff", "border": "#e5e7eb", "header": "#111827",
                   "accent": "#111827", "muted": "#4b5563", "decor": "#9ca3af"},
    "Ash": {"bg": "#f6f7f8", "fg": "#141618", "card": "#ffffff", "border": "#e4e6ea", "header": "#343a40",
            "accent": "#495057", "muted": "#6c757d", "decor": "#adb5bd"},
    "Navy": {"bg": "#f5f8ff", "fg": "#0b1c3a", "card": "#ffffff", "border": "#c7d2fe", "header": "#0b1c3a",
             "accent": "#1d4ed8", "muted": "#42526e", "decor": "#93c5fd"},
    "Azure": {"bg": "#eef6ff", "fg": "#0b2a3a", "card": "#ffffff", "border": "#cfe8ff", "header": "#0ea5e9",
              "accent": "#0284c7", "muted": "#3b5568", "decor": "#7dd3fc"},
    "Sky": {"bg": "#f0f9ff", "fg": "#0b2535", "card": "#ffffff", "border": "#bae6fd", "header": "#0369a1",
            "accent": "#0ea5e9", "muted": "#3f5866", "decor": "#60a5fa"},
    "Forest": {"bg": "#f7fff8", "fg": "#0f1a12", "card": "#ffffff", "border": "#bbf7d0", "header": "#166534",
               "accent": "#22c55e", "muted": "#385041", "decor": "#86efac"},
    "Mint": {"bg": "#effdf6", "fg": "#0a1510", "card": "#ffffff", "border": "#cdfaea", "header": "#047857",
             "accent": "#10b981", "muted": "#2f5e59", "decor": "#99f6e4"},
    "Teal": {"bg": "#f2fbfb", "fg": "#0b1b1b", "card": "#ffffff", "border": "#ccfbf1", "header": "#0f766e",
             "accent": "#14b8a6", "muted": "#405b5b", "decor": "#5eead4"},
    "Sunset": {"bg": "#fff7f8", "fg": "#241014", "card": "#ffffff", "border": "#ffd1dc", "header": "#be185d",
               "accent": "#f97316", "muted": "#574149", "decor": "#fb7185"},
    "Coral": {"bg": "#fff4f2", "fg": "#2f1210", "card": "#ffffff", "border": "#ffd5cc", "header": "#ea580c",
              "accent": "#f97316", "muted": "#6b3a30", "decor": "#ff9a8b"},
    # >>> PEACH theme: red + orange + yellow with a tiny light-green accent <<<
    "Peach": {"bg": "#fff5f2", "fg": "#2a0f0a", "card": "#ffffff", "border": "#fed7aa",
              "header": "#b91c1c", "accent": "#f97316", "muted": "#6b3f2a", "decor": "#bbf7d0"},
    "Gold": {"bg": "#fffbeb", "fg": "#2a1804", "card": "#ffffff", "border": "#fde68a", "header": "#a16207",
             "accent": "#f59e0b", "muted": "#6b5130", "decor": "#fcd34d"},
    "Bronze": {"bg": "#fff8f1", "fg": "#2a1002", "card": "#ffffff", "border": "#fed7aa", "header": "#92400e",
               "accent": "#d97706", "muted": "#6b3e28", "decor": "#fbbf24"},
    "Lavender": {"bg": "#faf5ff", "fg": "#1e1631", "card": "#ffffff", "border": "#e9d5ff", "header": "#6d28d9",
                 "accent": "#8b5cf6", "muted": "#4c3a63", "decor": "#c4b5fd"},
    "Orchid": {"bg": "#fdf4ff", "fg": "#21112a", "card": "#ffffff", "border": "#f5d0fe", "header": "#7e22ce",
               "accent": "#a855f7", "muted": "#51385f", "decor": "#e9d5ff"},
    "Grape": {"bg": "#faf5ff", "fg": "#1a0e2e", "card": "#ffffff", "border": "#e9d5ff", "header": "#581c87",
              "accent": "#7c3aed", "muted": "#4b2a66", "decor": "#d8b4fe"},
    "Charcoal": {"bg": "#0b0f14", "fg": "#edf2f7", "card": "#0f141b", "border": "#1f2733", "header": "#0b0f14",
                 "accent": "#2b3442", "muted": "#a0aec0", "decor": "#64748b"},
    "Ghost": {"bg": "#f9fafb", "fg": "#111827", "card": "#ffffff", "border": "#e5e7eb", "header": "#111827",
              "accent": "#6b7280", "muted": "#4b5563", "decor": "#d1d5db"},
    "Sand": {"bg": "#fffbf5", "fg": "#2a1d0c", "card": "#ffffff", "border": "#fdecc8", "header": "#92400e",
             "accent": "#eab308", "muted": "#6b5130", "decor": "#fde68a"},
    "Rose": {"bg": "#fff1f2", "fg": "#2a0e14", "card": "#ffffff", "border": "#fecdd3", "header": "#9f1239",
             "accent": "#e11d48", "muted": "#6b2a3a", "decor": "#fda4af"},
    "Coffee": {"bg": "#faf6f2", "fg": "#241c15", "card": "#ffffff", "border": "#eadbd3", "header": "#5c4033",
               "accent": "#7c4a3e", "muted": "#6b5b53", "decor": "#c8b6a6"},
    "Steel": {"bg": "#f5f7fa", "fg": "#0f172a", "card": "#ffffff", "border": "#e2e8f0", "header": "#1f2937",
              "accent": "#3b82f6", "muted": "#475569", "decor": "#93c5fd"},
    "Solarized Light": {"bg":"#fdf6e3","fg":"#073642","card":"#ffffff","border":"#eee8d5","header":"#586e75","accent":"#268bd2","muted":"#657b83","decor":"#b3c7d6"},
    "Solarized Dark": {"bg":"#002b36","fg":"#fdf6e3","card":"#00212b","border":"#073642","header":"#073642","accent":"#268bd2","muted":"#93a1a1","decor":"#839496"},
}

# ===================== GRADES & SUBJECTS =====================
def ordinal(n):
    if 10 <= n % 100 <= 20:
        suf = "th"
    else:
        suf = {1: "st", 2: "nd", 3: "rd"}.get(n % 10, "th")
    return "{}{} Grade".format(n, suf)

GRADES = ["Pre-K", "Kinder", "K"] + [ordinal(i) for i in range(1, 13)] + \
         ["Prealgebra", "Algebra", "Geometry", "Algebra 2", "Precalculus", "Calculus"]

def grade_rank(g):
    if g in GRADES: return GRADES.index(g)
    gl = g.lower()
    for i, name in enumerate(GRADES):
        if name.lower() == gl: return i
    return 6

def subjects_for_grade(grade):
    g = grade.lower()
    if "pre-k" in g:          return ["Counting", "Shapes", "Compare Numbers", "Time (to hour)"]
    if "kinder" in g or g == "k":
        return ["Counting", "Shapes", "Compare Numbers", "Addition", "Subtraction", "Time (to hour)", "Money (coins)"]
    if any(x in g for x in ["1st", "2nd", "3rd"]):
        return ["Addition", "Subtraction", "Place Value", "Time (to hour)", "Money (coins)"]
    if any(x in g for x in ["4th", "5th"]):
        return ["Addition", "Subtraction", "Multiplication", "Division", "Factors", "Multiples",
                "Fractions", "Time (to hour)", "Money (coins)"]
    if any(x in g for x in ["6th", "7th", "8th"]):
        return ["Integers (+/−)", "Multiplication", "Division", "Fractions", "Decimals", "Percentages", "Ratios",
                "Time (to hour)", "Money (coins)"]
    if "9th" in g:
        return ["Linear Eq (solve x)", "Evaluate Expr", "Inequalities", "Proportions",
                "Functions (f(x))", "Pythagorean (int)", "Quadratics (roots)", "Factoring"]
    if "10th" in g:
        return ["Angles (sum)", "Area (rect/tri)", "Pythagorean (int)", "Quadratics (roots)",
                "Systems (2x2)", "Exponents", "Factoring", "Functions (f(x))", "Trig Basics (sin 30)"]
    if "11th" in g:
        return ["Sequences (an)", "Functions (f(x))", "Exponents", "Quadratics (roots)",
                "Systems (2x2)", "Factoring", "Trig Basics (sin 30)", "Inequalities"]
    if "12th" in g:
        return ["Sequences (an)", "Functions (f(x))", "Trig Basics (sin 30)",
                "Derivative (poly)", "Limits (int)", "Slope at a point"]
    if "prealgebra" in g:
        return ["Integers (+/−)", "Exponents", "Order of Ops", "Fractions", "Ratios"]
    if "algebra 2" in g:
        return ["Quadratics (roots)", "Exponents", "Systems (2x2)", "Factoring"]
    if "algebra" in g:
        return ["Linear Eq (solve x)", "Evaluate Expr", "Inequalities", "Proportions"]
    if "geometry" in g:
        return ["Area (rect/tri)", "Perimeter", "Angles (sum)", "Pythagorean (int)"]
    if "precalculus" in g:
        return ["Sequences (an)", "Functions (f(x))", "Trig Basics (sin 30)"]
    if "calculus" in g:
        return ["Derivative (poly)", "Limits (int)", "Slope at a point"]
    return ["Addition", "Subtraction", "Multiplication", "Division"]

def topic_buckets_for_grade(grade):
    subs = subjects_for_grade(grade)
    easy = [s for s in subs if s in {
        "Counting", "Shapes", "Compare Numbers", "Addition", "Subtraction",
        "Place Value", "Time (to hour)", "Money (coins)", "Perimeter", "Sequences (an)", "Slope at a point"
    }]
    medium = [s for s in subs if s in {
        "Multiplication", "Division", "Fractions", "Decimals", "Percentages", "Ratios",
        "Factors", "Multiples", "Area (rect/tri)", "Angles (sum)", "Linear Eq (solve x)",
        "Evaluate Expr", "Proportions", "Functions (f(x))", "Pythagorean (int)"
    }]
    hard = [s for s in subs if s in {
        "Exponents", "Order of Ops", "Quadratics (roots)", "Systems (2x2)", "Factoring",
        "Inequalities", "Derivative (poly)", "Limits (int)", "Trig Basics (sin 30)"
    }]
    rest = [s for s in subs if s not in easy + medium + hard]
    medium += rest
    return {"easy": easy, "medium": medium, "hard": hard}

def bucket_of_subject(grade, subject):
    b = topic_buckets_for_grade(grade)
    if subject in b["easy"]: return "easy"
    if subject in b["hard"]: return "hard"
    return "medium"

BASE_MIX = {
    "Practice (EZ)": {"easy": 5, "medium": 2, "hard": 1},
    "Easy":          {"easy": 4, "medium": 3, "hard": 1},
    "Medium":        {"easy": 2, "medium": 3, "hard": 2},
    "Hard":          {"easy": 1, "medium": 3, "hard": 4},
    "XXX":           {"easy": 1, "medium": 2, "hard": 6},
}
HARDENING_FACTOR = 2.0  # overall harder

def hardened_mix(diff_label):
    m = dict(BASE_MIX.get(diff_label, BASE_MIX["Easy"]))
    m["hard"] = m.get("hard", 1) * (1.5 * HARDENING_FACTOR)
    m["medium"] = m.get("medium", 1) * (1.0 * HARDENING_FACTOR * 0.8)
    m["easy"] = max(0.5, m.get("easy", 1) / (1.2 * HARDENING_FACTOR))
    return m


# ===================== GENERATORS, TIME UTILS, HINTS =====================
def gen_add(lo, hi):
    a, b = random.randint(lo, hi), random.randint(lo, hi)
    return f"{a} + {b} = ?", a + b

def gen_sub(lo, hi):
    a, b = random.randint(lo, hi), random.randint(lo, hi)
    if a < b: a, b = b, a
    return f"{a} - {b} = ?", a - b

def gen_mul(lo, hi):
    a = random.randint(max(1, lo), max(1, min(18, int((hi or 12) * 1.5))))
    b = random.randint(max(1, lo), max(1, min(18, int((hi or 12) * 1.5))))
    return f"{a} × {b} = ?", a * b

def gen_div(lo, hi):
    b = random.randint(1, max(1, min(18, int((hi or 12) * 1.5))))
    ans = random.randint(1, max(1, min(18, int((hi or 12) * 1.5))))
    a = b * ans
    return f"{a} ÷ {b} = ?", ans

def gen_factors(lo, hi):
    n = random.randint(12, max(20, int(hi * 1.3)))
    return f"How many factors does {n} have?", sum(n % d == 0 for d in range(1, n + 1))

def gen_multiples(lo, hi):
    n = random.randint(3, 20); k = random.randint(3, 15)
    return f"{k}th multiple of {n}?", n * k

def gen_integers(lo, hi):
    span = max(hi, 10)
    a = random.randint(-span, span); b = random.randint(-span, span)
    return f"{a} + {b} = ?", a + b

def gen_exponents(lo, hi):
    a = random.randint(2, 9); b = random.randint(2, 6)
    return f"{a}^{b} = ?", a ** b

def gen_linear_eq(lo, hi):
    x = random.randint(-15, 15); a = random.randint(2, 12); b = random.randint(-20, 20)
    c = a * x + b
    return f"Solve x: {a}x + {b} = {c}", x

def gen_eval_expr(lo, hi):
    x = random.randint(-9, 9)
    a = random.randint(2, 12); b = random.randint(-12, 12)
    return f"Evaluate at x={x}: {a}x + {b}", a * x + b

def gen_ineq(lo, hi):
    x = random.randint(-12, 12); a = random.randint(2, 12); b = random.randint(-12, 12); c = a * x + b + random.randint(2, 7)
    return f"Smallest integer x: {a}x + {b} < {c}", x

def gen_prop(lo, hi):
    a, b = random.randint(2, 20), random.randint(2, 20); k = random.randint(2, 15)
    return f"{a}:{b} = x:{b * k}.  Find x", a * k

def gen_area_rect(lo, hi):
    w, h = random.randint(5, 40), random.randint(5, 40)
    return f"Area of rectangle {w}×{h}?", w * h

def gen_angles(lo, hi):
    a = random.randint(30, 150); b = random.randint(10, 170 - a)
    return f"Third angle of triangle with {a}° and {b}°?", 180 - a - b

def gen_pythag(lo, hi):
    triples = [(3, 4, 5), (5, 12, 13), (6, 8, 10), (7, 24, 25), (8, 15, 17)]
    a, b, c = random.choice(triples)
    if random.random() < 0.5: return f"Hypotenuse of {a},{b}?", c
    return f"Leg of right triangle with hyp={c}, other={a}?", b

def gen_sequence(lo, hi):
    a1, d, n = random.randint(2, 12), random.randint(2, 10), random.randint(5, 12)
    return f"a₁={a1}, d={d}. Find a{n}", a1 + (n - 1) * d

def gen_trig_basic(lo, hi):
    return "sin(30°) × 2 ?", 1

def gen_derivative_poly(lo, hi):
    a = random.randint(1, 9); b = random.randint(-9, 9); t = random.randint(-8, 8)
    return f"d/dx({a}x² + {b}x + c) at x={t}", 2 * a * t + b

def gen_limit_int(lo, hi):
    return "limₓ→0 (x+5−5)/x (integer result)", 1

def gen_slope_point(lo, hi):
    m = random.randint(-9, 9); b = random.randint(-12, 12); x0 = random.randint(-8, 8)
    return f"Slope of y={m}x+{b} at x={x0}", m

GEN_MAP = {
    "Addition": gen_add, "Subtraction": gen_sub, "Multiplication": gen_mul, "Division": gen_div,
    "Factors": gen_factors, "Multiples": gen_multiples, "Integers (+/−)": gen_integers,
    "Exponents": gen_exponents, "Order of Ops": gen_exponents,
    "Linear Eq (solve x)": gen_linear_eq, "Evaluate Expr": gen_eval_expr, "Inequalities": gen_ineq,
    "Proportions": gen_prop, "Ratios": gen_prop,
    "Area (rect/tri)": gen_area_rect, "Perimeter": gen_area_rect,
    "Angles (sum)": gen_angles, "Pythagorean (int)": gen_pythag,
    "Fractions": gen_add, "Decimals": gen_add, "Percentages": gen_mul,
    "Place Value": gen_add, "Time (to hour)": None,
    "Money (coins)": None,
    "Compare Numbers": gen_sub, "Counting": gen_add, "Shapes": gen_add,
    "Sequences (an)": gen_sequence, "Functions (f(x))": gen_eval_expr, "Trig Basics (sin 30)": gen_trig_basic,
    "Derivative (poly)": gen_derivative_poly, "Limits (int)": gen_limit_int, "Slope at a point": gen_slope_point,
    "Quadratics (roots)": gen_linear_eq, "Systems (2x2)": gen_linear_eq, "Factoring": gen_exponents,
}

def minutes_to_hhmm(m):
    m %= 24*60
    h, mm = divmod(m, 60)
    return f"{h:02d}:{mm:02d}"

def parse_time_str(s):
    s = s.strip().lower()
    m = re.match(r"^\s*(\d{1,2}):(\d{2})\s*(am|pm)?\s*$", s)
    if not m: return None
    h = int(m.group(1)); mm = int(m.group(2)); ap = m.group(3)
    if mm < 0 or mm >= 60: return None
    if ap:
        if h < 1 or h > 12: return None
        if ap == "am":
            h = 0 if h == 12 else h
        else:
            h = 12 if h == 12 else h + 12
    else:
        if h < 0 or h > 23: return None
    return h*60 + mm

def nums_in(text): return [int(x) for x in re.findall(r"-?\d+", text)]

def estimation_hint(text):
    ns = nums_in(text)
    if len(ns) >= 2:
        r10 = lambda n: round(n / 10) * 10
        approx = " + ".join(str(r10(n)) for n in ns[:2])
        return f"Estimate first: round to tens ({approx}) then adjust."
    return "Estimate first with easy numbers, then correct your estimate."

def subject_hints(subject, text, answer):
    hints = []
    if subject.startswith("Money"):
        hints += ["Quarters=25c, dimes=10c, nickels=5c, pennies=1c.",
                  "Change = amount paid − price (in cents)."]
    elif subject.startswith("Clock — Minutes Between"):
        hints += ["Convert each time to minutes since midnight, then subtract.",
                  "If end is earlier than start, read carefully: same day only."]
    elif subject.startswith("Clock — Add Minutes"):
        hints += ["Convert to minutes, add, then convert back to HH:MM (24-hour).",
                  "60 minutes = 1 hour; wrap after 23:59 to 00:00."]
    elif subject.startswith("Clock — Angle"):
        hints += ["Hour hand moves 0.5° per minute; minute hand 6° per minute.",
                  "Angle = |30*h + 0.5*m − 6*m|; smaller angle ≤ 180°."]
    elif subject == "Addition":
        hints += [estimation_hint(text), "Line up ones/tens/hundreds and add column by column."]
    elif subject == "Subtraction":
        hints += ["Borrow from the next place value if needed.", "Check by adding your result to the smaller number."]
    elif subject == "Multiplication":
        hints += ["Use distributive property: a×(b+c) = a×b + a×c.", "Think repeated addition; nearby easy facts help."]
    elif subject == "Division":
        hints += ["Think in multiples of the divisor and get close.", "Multiply back (quotient×divisor) to check."]
    elif subject == "Factors":
        hints += ["List factor pairs up to √n.", "Count both members of each pair."]
    elif subject == "Multiples":
        hints += ["The k-th multiple of n is n×k.", "Write a few: n, 2n, 3n, …"]
    elif subject == "Integers (+/−)":
        hints += ["Same signs add, different signs subtract.", "Visualize on a number line."]
    elif subject in ["Exponents", "Order of Ops", "Factoring"]:
        hints += ["a^b = a×a×… (b times).", "Handle parentheses/exponents before × ÷ + −."]
    elif subject == "Linear Eq (solve x)":
        m = re.search(r"Solve x:\s*(-?\d+)x\s*\+\s*(-?\d+)\s*=\s*(-?\d+)", text)
        if m:
            a, b, c = map(int, m.groups())
            hints += [f"Isolate x: subtract {b}, then divide by {a}.", "Check by substituting your x."]
        else:
            hints += ["Isolate x step by step: undo +/− first, then ×/÷."]
    elif subject in ["Evaluate Expr", "Functions (f(x))"]:
        m = re.search(r"x\s*=\s*(-?\d+)", text)
        if m:
            x = int(m.group(1)); hints += [f"Substitute x={x} and simplify.", "Do × before +."]
        else:
            hints += ["Plug in x and simplify carefully."]
    elif subject == "Inequalities":
        hints += ["Solve like an equation. If you ×/÷ by a negative, flip the sign!", "Test a nearby integer."]
    elif subject in ["Proportions", "Ratios"]:
        hints += ["Cross-multiply to solve.", "Scale both parts by the same number."]
    elif subject == "Area (rect/tri)":
        hints += ["Rectangle area = width × height.", "Units are squared."]
    elif subject == "Angles (sum)":
        hints += ["Triangle angles total 180°.", "Add the known two, subtract from 180°."]
    elif subject == "Pythagorean (int)":
        hints += ["Use a²+b²=c².", "Common triples: (3,4,5), (5,12,13), (8,15,17)."]
    elif subject == "Sequences (an)":
        hints += ["Arithmetic: aₙ = a₁ + (n−1)d.", "Add the common difference repeatedly."]
    elif subject == "Trig Basics (sin 30)":
        hints += ["sin 30° = 1/2.", "Use a 30-60-90 triangle."]
    elif subject == "Derivative (poly)":
        hints += ["d/dx(ax²+bx+c) = 2ax + b.", "Differentiate, then plug in x."]
    elif subject == "Limits (int)":
        hints += ["Simplify before taking the limit.", "This one becomes a constant integer."]
    elif subject == "Slope at a point":
        hints += ["For y=mx+b, slope is m everywhere.", "x doesn't change slope for a line."]
    else:
        hints += [estimation_hint(text), "Break the problem into smaller parts."]
    random.shuffle(hints)
    return hints[:2] if len(hints) >= 2 else hints


# ===================== APP =====================
class MathQuizApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Math Practice")
        self.root.geometry("1040x700")

        self.palette_name = "Ocean (Blue/White)"
        self.palette = PALETTES[self.palette_name]

        self.num_questions = 10
        self.current_q = 0
        self.attempts = 0
        self.questions = []
        self.progress_labels = []
        self._rb_frames = []
        self.user_selected_subj = False

        # scoring & recommendations
        self.correct_count = 0
        self.points_total = 0
        self.per_q_points = []
        self.subject_stats = defaultdict(lambda: {"attempts": 0, "solved": 0, "giveups": 0, "first_try": 0})

        # transient feedback overlay
        self._transient = None
        self._transient_jobs = []

        # loading animation (fallback if ever used)
        self._loading_job = None
        self._loading_dots = 0
        self.loading_base = "loading question; please be patient! (this may take quite a while)"

        # visuals
        self.explain_canvas = None

        self.style = ttk.Style(self.root)
        try:
            if "vista" in self.style.theme_names():
                self.style.theme_use("vista")
            elif "clam" in self.style.theme_names():
                self.style.theme_use("clam")
        except Exception:
            pass

        self.setup_start_screen()

    # ---------- assets ----------
    def circle_img(self, color, size):
        if PIL_OK:
            img = PILImage.new("RGBA", (size, size), (0, 0, 0, 0))
            draw = ImageDraw.Draw(img)
            draw.ellipse((1, 1, size - 1, size - 1), fill=color)
            return ImageTk.PhotoImage(img, master=self.root)
        return color

    def load_gif_frames(self, path, size=14):
        """Load GIF frames and apply a circular alpha mask so the badge looks round, not rectangular."""
        if not PIL_OK:
            return []
        frames = []
        # try both local and /mnt/data paths
        candidates = [path, "/mnt/data/rainbow.gif"]
        img = None
        for p in candidates:
            try:
                img = PILImage.open(p)
                break
            except Exception:
                continue
        if img is None:
            return frames
        # circular mask
        mask = PILImage.new("L", (size, size), 0)
        ImageDraw.Draw(mask).ellipse((0, 0, size - 1, size - 1), fill=255)

        try:
            while True:
                frame = img.copy().convert("RGBA").resize((size, size))
                frame.putalpha(mask)
                frames.append(ImageTk.PhotoImage(frame, master=self.root))
                img.seek(img.tell() + 1)
        except Exception:
            pass
        return frames

    # ---------- theme ----------
    def apply_palette_now(self, widgets):
        p = self.palette
        self.root.configure(bg=p["bg"])
        if hasattr(self, "header"): self.header.configure(bg=p["header"])
        if hasattr(self, "header_title"): self.header_title.configure(bg=p["header"], fg="#ffffff")
        if hasattr(self, "hero"): self.hero.configure(bg=p["bg"])
        if hasattr(self, "card"): self.card.configure(bg=p["card"], highlightbackground=p["border"], highlightcolor=p["border"])
        if hasattr(self, "footer"): self.footer.configure(bg=darken(p["bg"], 0.04))
        if hasattr(self, "progress_frame"): self.progress_frame.configure(bg=darken(p["bg"], 0.04))

        for w in widgets:
            try:
                if isinstance(w, tk.Label): w.configure(bg=p["card"], fg=p["fg"])
                elif isinstance(w, tk.Frame): w.configure(bg=p["card"])
                elif isinstance(w, tk.Button):
                    # Skip button styling - buttons have explicit colors set
                    pass
            except Exception:
                pass

        try:
            self.style.configure("TLabel", background=p["card"], foreground=p["fg"])
            self.style.configure("TFrame", background=p["card"])
            self.style.configure("TCombobox", 
                                fieldbackground="#ffffff" if p["bg"] != "#0a0a0a" else p["card"],
                                borderwidth=2,
                                relief="ridge",
                                focuscolor=p["accent"])
            # Rounded combobox with no border (background handles the styling)
            self.style.configure("Rounded.TCombobox",
                                fieldbackground="#ffffff" if p["bg"] != "#0a0a0a" else p["card"],
                                borderwidth=0,
                                relief="flat",
                                focuscolor="none")
            self.style.configure("TButton", padding=8)
        except Exception:
            pass

        for attr in ("start_btn", "check_btn", "giveup_btn"):
            if hasattr(self, attr):
                btn = getattr(self, attr)
                try:
                    if attr == "giveup_btn":
                        btn.configure(bg="#e11d48", fg="white", activebackground="#9f1239", activeforeground="white")
                    else:
                        btn.configure(bg=p["accent"], fg="white", activebackground=darken(p["accent"], 0.2), activeforeground="white")
                except Exception:
                    # Button may have been destroyed during window transition
                    pass

        if hasattr(self, "banner"):
            self.draw_gradient(self.banner, self.palette["accent"], darken(self.palette["accent"], 0.4))
        
        # Update arrow colors
        self.update_arrow_colors()

    def create_rounded_combobox(self, parent, textvariable, values, width=28):
        """Create a custom rounded dropdown with speech bubble arrow"""
        frame = tk.Frame(parent, bg=self.palette["card"])
        
        # Main canvas for rounded background - make it visible
        canvas_width = width*7 + 20
        canvas_height = 28
        main_canvas = tk.Canvas(frame, width=canvas_width, height=canvas_height, 
                               highlightthickness=0, bd=0, bg=self.palette["card"])
        main_canvas.pack(side="left", padx=2)
        
        # Speech bubble arrow
        arrow_canvas = tk.Canvas(frame, width=30, height=canvas_height, 
                                highlightthickness=0, bd=0, bg=self.palette["card"])  
        arrow_canvas.pack(side="left", padx=(5, 0))
        
        # Draw the rounded background first
        self.draw_simple_rounded_rect(main_canvas)
        
        # Create the dropdown button - smaller so background shows
        fill_color = "#ffffff" if self.palette["bg"] != "#0a0a0a" else self.palette["card"]
        dropdown_btn = tk.Button(main_canvas, text=textvariable.get() or (values[0] if values else ""), 
                                relief="flat", bd=0, highlightthickness=0,
                                anchor="w", padx=10, font=("Helvetica", 10),
                                bg=fill_color, fg=self.palette["fg"],
                                activebackground=darken(fill_color, 0.05),
                                cursor="hand2")
        # Position button inside the canvas, smaller than the background
        dropdown_btn.place(x=4, y=4, width=canvas_width-8, height=canvas_height-8)
        
        # Draw the arrow
        self.draw_simple_arrow(arrow_canvas)
        
        # Store values and variable for dropdown functionality
        dropdown_btn._values = values
        dropdown_btn._variable = textvariable
        dropdown_btn._parent_frame = frame
        
        # Bind click to show dropdown menu
        dropdown_btn.configure(command=lambda: self.show_dropdown_menu(dropdown_btn))
        
        return frame, dropdown_btn, main_canvas, arrow_canvas

    def draw_simple_rounded_rect(self, canvas):
        """Draw a clean rounded rectangle without artifacts"""
        w = int(canvas['width'])
        h = int(canvas['height'])
        canvas.delete("all")
        
        # Use accent color for border, white/card color for fill
        border_color = self.palette["accent"]
        fill_color = "#ffffff" if self.palette["bg"] != "#0a0a0a" else self.palette["card"]
        
        # Draw solid background first (no outline to avoid artifacts)
        radius = 8
        canvas.create_rectangle(radius, 1, w-radius, h-1, fill=fill_color, outline="")
        canvas.create_rectangle(1, radius, w-1, h-radius, fill=fill_color, outline="")
        
        # Fill corner areas
        canvas.create_oval(1, 1, radius*2-1, radius*2-1, fill=fill_color, outline="")
        canvas.create_oval(w-radius*2+1, 1, w-1, radius*2-1, fill=fill_color, outline="")
        canvas.create_oval(1, h-radius*2+1, radius*2-1, h-1, fill=fill_color, outline="")
        canvas.create_oval(w-radius*2+1, h-radius*2+1, w-1, h-1, fill=fill_color, outline="")
        
        # Draw clean border lines
        canvas.create_line(radius, 1, w-radius, 1, fill=border_color, width=2)  # top
        canvas.create_line(radius, h-1, w-radius, h-1, fill=border_color, width=2)  # bottom  
        canvas.create_line(1, radius, 1, h-radius, fill=border_color, width=2)  # left
        canvas.create_line(w-1, radius, w-1, h-radius, fill=border_color, width=2)  # right
        
        # Draw corner arcs
        canvas.create_arc(1, 1, radius*2-1, radius*2-1, start=90, extent=90, outline=border_color, width=2, style="arc")
        canvas.create_arc(w-radius*2+1, 1, w-1, radius*2-1, start=0, extent=90, outline=border_color, width=2, style="arc")
        canvas.create_arc(1, h-radius*2+1, radius*2-1, h-1, start=180, extent=90, outline=border_color, width=2, style="arc")
        canvas.create_arc(w-radius*2+1, h-radius*2+1, w-1, h-1, start=270, extent=90, outline=border_color, width=2, style="arc")

    def draw_simple_arrow(self, canvas):
        """Draw a simple speech bubble arrow"""
        w = int(canvas['width'])
        h = int(canvas['height'])
        canvas.delete("all")
        
        mid_y = h // 2
        accent_color = self.palette["accent"]
        
        # Draw triangle pointing left
        canvas.create_polygon(
            5, mid_y,         # tip
            15, mid_y - 6,    # top
            15, mid_y + 6,    # bottom
            fill=accent_color, outline=accent_color
        )

    def show_dropdown_menu(self, dropdown_btn):
        """Show dropdown menu when button is clicked"""
        try:
            menu = tk.Menu(self.root, tearoff=0)
            for value in dropdown_btn._values:
                menu.add_command(label=value, 
                                command=lambda v=value: self.select_dropdown_value(dropdown_btn, v))
            
            # Position menu below the button
            x = dropdown_btn.winfo_rootx()
            y = dropdown_btn.winfo_rooty() + dropdown_btn.winfo_height()
            menu.post(x, y)
        except Exception as e:
            print(f"Dropdown menu error: {e}")

    def select_dropdown_value(self, dropdown_btn, value):
        """Handle dropdown value selection"""
        dropdown_btn._variable.set(value)
        dropdown_btn.configure(text=value)
        
        # Trigger any bound events
        if hasattr(dropdown_btn, '_on_change'):
            dropdown_btn._on_change()


    def update_arrow_colors(self):
        """Update all arrow colors to match current theme"""
        arrow_attrs = ['theme_arrow', 'grade_arrow', 'focus_arrow', 'subj_arrow', 'diff_arrow']
        for attr_name in arrow_attrs:
            if hasattr(self, attr_name):
                arrow = getattr(self, attr_name)
                try:
                    arrow.configure(fg=self.palette["accent"])
                except Exception:
                    # Arrow may have been destroyed during window transition
                    pass
        
        # Update rounded combobox backgrounds and arrows
        self.update_rounded_comboboxes()

    def update_rounded_comboboxes(self):
        """Update all rounded combobox backgrounds and arrows with current theme"""
        rounded_combos = [
            ('theme_bg_canvas', 'theme_arrow_canvas'),
            ('grade_bg_canvas', 'grade_arrow_canvas'), 
            ('focus_bg_canvas', 'focus_arrow_canvas'),
            ('subj_bg_canvas', 'subj_arrow_canvas'),
            ('diff_bg_canvas', 'diff_arrow_canvas')
        ]
        
        for bg_attr, arrow_attr in rounded_combos:
            if hasattr(self, bg_attr) and hasattr(self, arrow_attr):
                try:
                    bg_canvas = getattr(self, bg_attr)
                    arrow_canvas = getattr(self, arrow_attr)
                    self.draw_simple_rounded_rect(bg_canvas)
                    self.draw_simple_arrow(arrow_canvas)
                except Exception:
                    # Canvas may have been destroyed
                    pass

    def fade_to_palette(self, new_name, widgets, steps=42, ms=14):
        old = self.palette
        newp = PALETTES[new_name]
        keys = ["bg", "card", "border", "header", "accent"]

        def step(i=0):
            if i > steps:
                self.palette_name = new_name
                self.palette = newp
                self.apply_palette_now(widgets)
                return
            t = i / steps
            blend = {k: lerp_hex(old[k], newp[k], t) for k in keys}
            try:
                self.root.configure(bg=blend["bg"])
                if hasattr(self, "header"):
                    self.header.configure(bg=blend["header"])
                    self.header_title.configure(bg=blend["header"])
                if hasattr(self, "card"):
                    self.card.configure(bg=blend["card"], highlightbackground=blend["border"], highlightcolor=blend["border"])
                if hasattr(self, "banner"):
                    self.draw_gradient(self.banner, blend["accent"], darken(newp["accent"], 0.4))
                for attr in ("start_btn", "check_btn"):
                    if hasattr(self, attr):
                        getattr(self, attr).configure(bg=blend["accent"])
                if hasattr(self, "footer"):
                    self.footer.configure(bg=darken(blend["bg"], 0.04))
                if hasattr(self, "progress_frame"):
                    self.progress_frame.configure(bg=darken(blend["bg"], 0.04))
            except Exception:
                pass
            self.root.after(ms, lambda: step(i + 1))
        step()

    def draw_gradient(self, canvas, c1, c2):
        canvas.delete("all")
        w = int(canvas["width"]); h = int(canvas["height"])
        steps = 100
        step_height = h / steps
        for i in range(steps):
            t = i / (steps - 1)
            color = lerp_hex(c1, c2, t)
            y0 = int(i * step_height)
            y1 = int((i + 1) * step_height) + 1  # Add 1 to prevent gaps
            canvas.create_rectangle(0, y0, w, y1, outline="", fill=color)
        # Ensure full coverage by adding a final rectangle if needed
        if steps * step_height < h:
            canvas.create_rectangle(0, int(steps * step_height), w, h, outline="", fill=c2)

    # ---------- setup ----------
    def setup_start_screen(self):
        self.clear_window()
        # unbind Return if we had it from quiz
        try: self.root.unbind("<Return>")
        except Exception: pass

        self.header = tk.Frame(self.root, height=58)
        self.header.pack(fill="x", side="top")
        self.header_title = tk.Label(self.header, text="Math Practice", font=("Helvetica", 18, "bold"), fg="#ffffff")
        self.header_title.pack(padx=24, pady=10, anchor="w")

        self.hero = tk.Frame(self.root); self.hero.pack(fill="x")
        self.banner = tk.Canvas(self.hero, width=1040, height=140, highlightthickness=0, bd=0)
        self.banner.pack(fill="x")
        # Force canvas to update its size before drawing
        self.banner.update_idletasks()
        self.draw_gradient(self.banner, self.palette["accent"], darken(self.palette["accent"], 0.4))

        self.card = tk.Frame(self.root, bd=1, relief="solid", highlightthickness=1)
        self.card.place(relx=0.5, rely=0.55, anchor="c", width=700, height=540)

        title = tk.Label(self.card, text="Build Your Practice", font=("Helvetica", 24, "bold")); title.pack(pady=(18, 4))
        subtitle = tk.Label(self.card, text="Pick a theme, grade, focus, difficulty, and # of questions.", font=("Helvetica", 11))
        subtitle.pack(pady=(0, 14))
        form = tk.Frame(self.card); form.pack(pady=6)

        tk.Label(form, text="Theme (colors)").grid(row=0, column=0, sticky="w", padx=10, pady=6)
        self.theme_var = tk.StringVar(value=self.palette_name)
        self.theme_frame, self.theme_box, self.theme_bg_canvas, self.theme_arrow_canvas = \
            self.create_rounded_combobox(form, self.theme_var, list(PALETTES.keys()))
        self.theme_frame.grid(row=0, column=1, padx=10, pady=6, sticky="w")
        self.theme_box._on_change = self.on_theme_change

        tk.Label(form, text="Grade Level").grid(row=1, column=0, sticky="w", padx=10, pady=6)
        self.grade_var = tk.StringVar(value=GRADES[0])
        self.grade_frame, self.grade_box, self.grade_bg_canvas, self.grade_arrow_canvas = \
            self.create_rounded_combobox(form, self.grade_var, GRADES)
        self.grade_frame.grid(row=1, column=1, padx=10, pady=6, sticky="w")
        self.grade_box._on_change = self.on_grade_selected

        self.focus_label = tk.Label(form, text="Focus Mode")
        self.focus_var = tk.StringVar(value="General")
        self.focus_frame, self.focus_box, self.focus_bg_canvas, self.focus_arrow_canvas = \
            self.create_rounded_combobox(form, self.focus_var, 
                                       ["General", "Single Subject", "Multiple Subjects"])
        self.focus_box._on_change = self.on_focus_mode
        self.focus_label.grid_remove(); self.focus_frame.grid_remove()

        self.slide_container = tk.Frame(form, height=1); self.slide_container.grid_propagate(False)
        self.slide_container.grid_remove()

        self.subj_label = tk.Label(self.slide_container, text="Subject")
        self.subj_var = tk.StringVar(value="")
        self.subj_frame, self.subj_box, self.subj_bg_canvas, self.subj_arrow_canvas = \
            self.create_rounded_combobox(self.slide_container, self.subj_var, [])
        self.subj_box._on_change = lambda: setattr(self, "user_selected_subj", True)

        self.multi_label = tk.Label(self.slide_container, text="Subjects (Ctrl/Cmd+click)")
        self.multi_list = tk.Listbox(self.slide_container, selectmode="multiple", height=6, exportselection=False, width=30)

        tk.Label(form, text="Difficulty").grid(row=5, column=0, sticky="w", padx=10, pady=6)
        self.diff_var = tk.StringVar(value="Easy")
        self.diff_frame, self.diff_box, self.diff_bg_canvas, self.diff_arrow_canvas = \
            self.create_rounded_combobox(form, self.diff_var,
                                       ["Practice (EZ)", "Easy", "Medium", "Hard", "XXX"])
        self.diff_frame.grid(row=5, column=1, padx=10, pady=6, sticky="w")
        self.diff_box._on_change = self.on_difficulty_change

        tk.Label(form, text="Number of Questions").grid(row=6, column=0, sticky="w", padx=10, pady=6)
        self.num_var = tk.IntVar(value=10)
        self.num_spin = tk.Spinbox(form, from_=1, to=30, textvariable=self.num_var, width=10)
        self.num_spin.grid(row=6, column=1, sticky="w", padx=10, pady=6)

        btn_row = tk.Frame(self.card); btn_row.pack(pady=14)
        self.start_btn = tk.Button(btn_row, text="Start Quiz", command=self.start_quiz, 
                                  width=16, height=1, cursor="hand2",
                                  bg=self.palette["accent"], fg="white", relief="flat", bd=1,
                                  activebackground=darken(self.palette["accent"], 0.2), activeforeground="white",
                                  font=("Helvetica", 12, "bold"))
        self.start_btn.pack(pady=10)

        self.footer = tk.Frame(self.root, height=22); self.footer.pack(side="bottom", fill="x")
        self.apply_palette_now([self.card, title, subtitle, form, btn_row])
        # Ensure button visibility after palette application
        self.start_btn.configure(fg="#374151")

    # ---------- subject weighting ----------
    def choose_subject_weighted(self, candidate_subjects):
        if not candidate_subjects:
            return "Addition"
        mix = hardened_mix(self.diff_var.get())
        weights = []
        for s in candidate_subjects:
            b = bucket_of_subject(self.grade_var.get(), s)
            weights.append(mix.get(b, 1))
        try:
            return random.choices(candidate_subjects, weights=weights, k=1)[0]
        except Exception:
            total = sum(max(1, w) for w in weights)
            r = random.randint(1, total)
            cum = 0
            for s, w in zip(candidate_subjects, weights):
                cum += max(1, w)
                if r <= cum:
                    return s
            return candidate_subjects[0]

    def refresh_subject_sources(self):
        subs_all = subjects_for_grade(self.grade_var.get())
        mix = hardened_mix(self.diff_var.get())

        def order_key(s):
            b = bucket_of_subject(self.grade_var.get(), s)
            return -mix.get(b, 1)

        subs_sorted = sorted(subs_all, key=order_key)
        if hasattr(self, 'subj_box'):
            self.subj_box._values = subs_sorted  # Update values for custom dropdown
            if not self.user_selected_subj:
                selected = self.choose_subject_weighted(subs_sorted)
                self.subj_var.set(selected)
                self.subj_box.configure(text=selected)
            elif self.subj_var.get() not in subs_sorted and subs_sorted:
                self.subj_var.set(subs_sorted[0])
                self.subj_box.configure(text=subs_sorted[0])

        if hasattr(self, 'multi_list'):
            self.multi_list.delete(0, "end")
            for s in subs_sorted:
                self.multi_list.insert("end", s)

    # ---------- events ----------
    def on_theme_change(self, _=None):
        new_name = self.theme_var.get()
        widgets = [self.card] + list(self.card.winfo_children())
        self.fade_to_palette(new_name, widgets)

    def on_grade_selected(self, _=None):
        self.focus_label.grid(row=2, column=0, sticky="w", padx=10, pady=6)
        self.focus_frame.grid(row=2, column=1, padx=10, pady=6, sticky="w")
        self.slide_container.grid_remove()
        self.slide_container.configure(height=1)
        self.user_selected_subj = False
        self.refresh_subject_sources()
        if self.focus_var.get() in ("Single Subject", "Multiple Subjects"):
            self.on_focus_mode()

    def on_difficulty_change(self, _=None):
        self.user_selected_subj = False
        self.refresh_subject_sources()

    def animate_expand(self, target_h=80, step=6, ms=10):
        cur = int(self.slide_container["height"])
        if cur >= target_h: return
        self.slide_container.configure(height=cur + step)
        self.root.after(ms, lambda: self.animate_expand(target_h, step, ms))

    def on_focus_mode(self, _=None):
        mode = self.focus_var.get()
        self.user_selected_subj = False
        self.refresh_subject_sources()

        self.slide_container.grid(row=3, column=0, columnspan=2, sticky="we", padx=10, pady=(0, 6))
        self.slide_container.tkraise()
        self.slide_container.grid_propagate(False)
        for w in self.slide_container.winfo_children(): w.grid_forget()

        if mode == "Single Subject":
            self.subj_label.grid(row=0, column=0, sticky="w", padx=2, pady=(8, 2))
            self.subj_frame.grid(row=0, column=1, padx=4, pady=(8, 2))
            # Update subject combobox values and redraw
            if hasattr(self, 'subj_bg_canvas'):
                self.draw_simple_rounded_rect(self.subj_bg_canvas)
                self.draw_simple_arrow(self.subj_arrow_canvas)
            target_h = 60
        elif mode == "Multiple Subjects":
            self.multi_label.grid(row=0, column=0, sticky="w", padx=2, pady=(8, 2))
            self.multi_list.grid(row=1, column=0, columnspan=2, sticky="we", padx=2, pady=(0, 8))
            target_h = 110
        else:
            self.slide_container.grid_remove()
            return

        self.slide_container.configure(height=1)
        self.animate_expand(target_h=target_h)

    # ---------- loading animation (fallback) ----------
    def start_loading_animation(self):
        self._loading_dots = 0
        if not hasattr(self, "question_label"):
            return
        self.question_label.config(text=self.loading_base)
        def tick():
            txt = f"{self.loading_base}{'.' * self._loading_dots}"
            self.question_label.config(text=txt)
            self._loading_dots = (self._loading_dots + 1) % 4
            self._loading_job = self.root.after(400, tick)
        self._loading_job = self.root.after(400, tick)

    def stop_loading_animation(self):
        if self._loading_job is not None:
            try: self.root.after_cancel(self._loading_job)
            except Exception: pass
            self._loading_job = None

    # ---------- numeric ranges ----------
    def num_range(self, grade, difficulty):
        g = grade.lower()
        if "pre-k" in g or "kinder" in g or g == "k": base = 5
        elif any(x in g for x in ["1st", "2nd", "3rd"]): base = 20
        elif any(x in g for x in ["4th", "5th"]): base = 80
        elif any(x in g for x in ["6th", "7th", "8th"]): base = 150
        else: base = 220
        mult0 = {"Practice (EZ)": 0.6, "Easy": 1.0, "Medium": 1.6, "Hard": 2.2, "XXX": 3.2}.get(difficulty, 1.0)
        mult = mult0 * HARDENING_FACTOR
        return 0, max(5, int(base * mult))

    # ---------- Money & Time random problems ----------
    def gen_money_problem(self):
        diff = self.diff_var.get()
        w_total = 6 if diff in ("Practice (EZ)", "Easy") else 3
        w_change = 2 if diff in ("Practice (EZ)", "Easy") else (4 if diff == "Medium" else 6)
        w_mincoins = 1 if diff in ("Practice (EZ)", "Easy") else (3 if diff == "Medium" else 5)
        choice = random.choices(["total", "change", "mincoins"], weights=[w_total, w_change, w_mincoins])[0]

        def total_problem():
            q = random.randint(0, 8); d = random.randint(0, 10); n = random.randint(0, 10); p = random.randint(0, 20)
            total = 25*q + 10*d + 5*n + p
            text = (f"Money (coins): Sam has {q} quarter(s), {d} dime(s), {n} nickel(s), and {p} penn{'y' if p==1 else 'ies'}.\n"
                    f"How many cents is that in total?")
            return text, total, "Money — Coin Total", "int"

        def change_problem():
            price = random.randint(50, 500) // 5 * 5
            q = random.randint(0, 12); d = random.randint(0, 10); n = random.randint(0, 10)
            pay = 25*q + 10*d + 5*n
            if pay < price:
                for _ in range(20):
                    add = random.choice([25, 10, 5])
                    pay += add
                    if add == 25: q += 1
                    elif add == 10: d += 1
                    else: n += 1
                    if pay >= price: break
            if pay < price: pay = price
            change = pay - price
            text = (f"Money (coins): A toy costs ${price//100}.{price%100:02d}. "
                    f"Alex pays with {q} quarter(s), {d} dime(s), and {n} nickel(s).\n"
                    f"How much change (in cents) does Alex receive?")
            return text, change, "Money — Making Change", "int"

        def min_coins_problem():
            amount = random.randint(30, 300) // 5 * 5
            q = amount // 25; r = amount % 25
            d = r // 10; r = r % 10
            n = r // 5; r = r % 5
            p = r
            fewest = q + d + n + p
            text = (f"Money (coins): Using only US coins (25c, 10c, 5c, 1c),\n"
                    f"what is the fewest number of coins to make {amount} cents?")
            return text, fewest, "Money — Fewest Coins", "int"

        if choice == "change":
            return change_problem()
        elif choice == "mincoins":
            return min_coins_problem()
        return total_problem()

    def gen_clock_problem(self):
        gr = grade_rank(self.grade_var.get())
        diff = self.diff_var.get()
        w_between = 6 if diff in ("Practice (EZ)", "Easy") else 4
        w_add = 3 if diff in ("Practice (EZ)", "Easy") else 5
        w_angle = 0 if gr < 6 else (2 if diff in ("Practice (EZ)", "Easy") else (4 if diff == "Medium" else 7))
        choice = random.choices(["between", "add", "angle"], weights=[w_between, w_add, w_angle])[0]

        def rand_time():
            h = random.randint(0, 23); m = random.randint(0, 59)
            return h*60 + m

        def between_problem():
            t1 = rand_time(); t2 = rand_time()
            if t2 < t1: t1, t2 = t2, t1
            text = ("Clock: On the same day, how many minutes are between "
                    f"{minutes_to_hhmm(t1)} and {minutes_to_hhmm(t2)}?")
            return text, (t2 - t1), "Clock — Minutes Between", "int", t1, t2

        def add_problem():
            t1 = rand_time(); addm = random.randint(5, 300)
            ans = (t1 + addm) % (24*60)
            text = (f"Clock: Starting at {minutes_to_hhmm(t1)}, after {addm} minute(s) "
                    f"what time is it? (Answer as HH:MM in 24-hour time)")
            return text, ans, "Clock — Add Minutes", "time", t1, None

        def angle_problem():
            h = random.randint(0, 11); m = random.randint(0, 59)
            angle = abs(30*h + 0.5*m - 6*m)
            angle = int(round(min(angle, 360 - angle)))
            text = (f"Clock: On an analog clock, what is the angle (degrees) between the hour and "
                    f"minute hands at {h:02d}:{m:02d}? (Nearest degree)")
            return text, angle, "Clock — Angle", "int", h*60 + m, None

        if choice == "between":
            t = between_problem()
        elif choice == "angle":
            t = angle_problem()
        else:
            t = add_problem()

        text, ans, subj, kind, extra1, extra2 = t
        self._clock_extra = (subj, extra1, extra2)
        return text, ans, subj, kind

    def build_one(self, subj, lo, hi):
        if "Money" in subj:
            text, ans, subj_label, ans_kind = self.gen_money_problem()
            hints = subject_hints(subj_label, text, ans)
            return text, ans, subj_label, hints, ans_kind
        if "Time (to hour)" in subj:
            text, ans, subj_label, ans_kind = self.gen_clock_problem()
            hints = subject_hints(subj_label, text, ans)
            return text, ans, subj_label, hints, ans_kind
        gen = GEN_MAP.get(subj) or random.choice([gen_add, gen_sub, gen_mul, gen_div])
        text, ans = gen(lo, hi)
        subj_label = subj
        hints = subject_hints(subj_label, text, int(ans))
        return text, int(ans), subj_label, hints, "int"

    def build_questions(self, n):
        lo, hi = self.num_range(self.grade_var.get(), self.diff_var.get())
        mode = self.focus_var.get()
        subjects = subjects_for_grade(self.grade_var.get())

        if mode == "Single Subject":
            if not self.user_selected_subj:
                chosen_list = [self.choose_subject_weighted(subjects)]
                self.subj_var.set(chosen_list[0])
            else:
                chosen_list = [self.subj_var.get().strip() or (subjects[0] if subjects else "Addition")]
        elif mode == "Multiple Subjects":
            idxs = self.multi_list.curselection()
            selected = [self.multi_list.get(i) for i in idxs]
            chosen_list = selected or subjects[:min(5, len(subjects))]
        else:
            chosen_list = subjects or ["Addition", "Subtraction", "Multiplication", "Division"]

        if not chosen_list:
            chosen_list = ["Addition", "Subtraction"]

        out = []
        for _ in range(n):
            subj_pick = self.choose_subject_weighted(chosen_list)
            text, ans, subj_label, hints, ans_kind = self.build_one(subj_pick, lo, hi)
            if not text or not isinstance(text, str): text = "Compute the value:"
            out.append((text, ans, subj_label, hints, ans_kind))
        return out

    # ---------- start quiz ----------
    def start_quiz(self):
        self.palette = PALETTES[self.palette_name]
        self.num_questions = int(self.num_var.get())
        self.current_q = 0
        self.correct_count = 0
        self.points_total = 0
        self.per_q_points = [0] * self.num_questions
        self.subject_stats = defaultdict(lambda: {"attempts": 0, "solved": 0, "giveups": 0, "first_try": 0})

        self.questions = self.build_questions(self.num_questions)
        print(f"Debug: Generated {len(self.questions) if self.questions else 0} questions")  # Debug
        if not self.questions:
            print("Debug: No questions generated, using fallback")  # Debug
            self.questions = [("2 + 3 = ?", 5, "Addition", ["Add ones then tens.", "Check by subtraction."], "int")]

        # rainbow frames: circular & slowed down
        self._rb_frames = self.load_gif_frames("rainbow.gif", 14)
        self._rb_delay = 180  # 50% slower than 120 → use 180ms

        size = 14
        self.dot_gray = self.circle_img("#d1d5db", size)
        self.dot_red = self.circle_img("#ef4444", size)
        self.dot_yellow = self.circle_img("#f59e0b", size)
        self.dot_green = self.circle_img("#22c55e", size)

        self.clear_window(keep_footer=True)

        self.header = tk.Frame(self.root, height=58); self.header.pack(fill="x", side="top")
        self.header_title = tk.Label(self.header, text="Math Practice", font=("Helvetica", 18, "bold"), fg="#ffffff")
        self.header_title.pack(padx=24, pady=10, anchor="w")

        self.hero = tk.Frame(self.root); self.hero.pack(fill="x")
        self.banner = tk.Canvas(self.hero, width=1040, height=100, highlightthickness=0, bd=0)
        self.banner.pack(fill="x")
        # Force canvas to update its size before drawing
        self.banner.update_idletasks()
        self.draw_gradient(self.banner, self.palette["accent"], darken(self.palette["accent"], 0.4))

        self.card = tk.Frame(self.root, bd=1, relief="solid", highlightthickness=1)
        self.card.place(relx=0.5, rely=0.55, anchor="c", width=800, height=560)

        title = tk.Label(self.card, text="Let’s practice!", font=("Helvetica", 24, "bold")); title.pack(pady=(18, 4))
        sub = tk.Label(self.card, text=f"Focus Mode: {self.focus_var.get()} • 3 tries • −2 per wrong • 8pts for 1st try",
                       font=("Helvetica", 11)); sub.pack(pady=(0, 12))

        self.question_label = tk.Label(self.card, font=("Helvetica", 20, "bold"), wraplength=800, justify="left")
        self.question_label.pack(pady=(6, 8))

        self.explain_canvas = tk.Canvas(self.card, width=620, height=210, bg="#ffffff", highlightthickness=1)
        self.explain_canvas.pack(pady=(0, 10))

        entry_row = tk.Frame(self.card); entry_row.pack(pady=(0, 8))
        self.answer_entry = tk.Entry(entry_row, font=("Helvetica", 18), width=18, justify="center")
        self.answer_entry.grid(row=0, column=0, padx=6)
        self.check_btn = tk.Button(entry_row, text="Check (Enter)", width=12, cursor="hand2", command=self.check_answer,
                                  bg=self.palette["accent"], fg="white", relief="flat", bd=1,
                                  activebackground=darken(self.palette["accent"], 0.2), activeforeground="white")
        self.check_btn.grid(row=0, column=1, padx=4)
        self.giveup_btn = tk.Button(entry_row, text="Give Up (G)", width=12, cursor="hand2", command=self.give_up,
                                   bg="#6b7280", fg="white", relief="flat", bd=1,
                                   activebackground="#4b5563", activeforeground="white")
        self.giveup_btn.grid(row=0, column=2, padx=4)

        self.feedback_label = tk.Label(self.card, text="", font=("Helvetica", 12))
        self.feedback_label.pack(pady=(6, 0))

        self.footer = tk.Frame(self.root, height=24); self.footer.pack(side="bottom", fill="x")
        self.progress_frame = tk.Frame(self.footer); self.progress_frame.pack(pady=2)
        self.progress_labels = []
        for i in range(self.num_questions):
            if PIL_OK:
                lbl = tk.Label(self.progress_frame, image=self.dot_gray, bd=0, bg=darken(self.palette["bg"], 0.04))
            else:
                lbl = tk.Canvas(self.progress_frame, width=size, height=size, highlightthickness=0,
                                bg=darken(self.palette["bg"], 0.04))
                lbl.create_oval(1, 1, size - 1, size - 1, fill="#d1d5db", outline="")
            lbl.grid(row=0, column=i, padx=2); self.progress_labels.append(lbl)

        self.apply_palette_now([title, sub, self.question_label, self.explain_canvas, entry_row, self.feedback_label])
        # Ensure button visibility after palette application
        self.check_btn.configure(fg="#374151")
        self.giveup_btn.configure(fg="#374151")

        # keyboard shortcuts
        self.answer_entry.bind("<Return>", lambda e: self.check_answer())
        self.root.bind("<Return>", lambda e: self.check_answer())  # global Enter
        self.root.bind("g", lambda e: self.give_up())

        # FIRST question immediately  
        self.root.after(100, self.show_question)  # Delay slightly to ensure everything is ready

    # ---------- visuals ----------
    def clear_visual(self):
        c = self.explain_canvas
        c.delete("all")
        try: c.configure(bg=self.palette["card"], highlightbackground=self.palette["border"])
        except Exception: pass

    def draw_number_line(self, a, b):
        c = self.explain_canvas; w, h = 620, 210
        c.create_rectangle(1, 1, w - 1, h - 1, outline=self.palette["border"])
        pad = 40; y = 120
        c.create_line(pad, y, w - pad, y, width=2)
        lo = min(a, b, 0); hi = max(a, b, 0); rng = max(5, hi - lo)
        ticks = 10
        for i in range(ticks + 1):
            x = pad + (w - 2 * pad) * i / ticks
            c.create_line(x, y - 6, x, y + 6)
            v = int(round(lo + rng * i / ticks))
            c.create_text(x, y + 18, text=str(v), font=("Helvetica", 9), fill=self.palette["muted"])
        ax = pad + (w - 2 * pad) * (a - lo) / rng
        bx = pad + (w - 2 * pad) * (b - lo) / rng
        c.create_oval(ax - 5, y - 5, ax + 5, y + 5, fill="#22c55e", outline="")
        c.create_oval(bx - 5, y - 5, bx + 5, y + 5, fill="#ef4444", outline="")
        c.create_text(w / 2, 30, text="Number line (green → red)", font=("Helvetica", 10), fill=self.palette["muted"])

    def draw_rect_area(self, w_rect, h_rect):
        c = self.explain_canvas; W, H = 620, 210
        c.create_rectangle(1, 1, W - 1, H - 1, outline=self.palette["border"])
        sx = (W - 160) / max(1, w_rect); sy = (H - 80) / max(1, h_rect)
        s = max(10, min(sx, sy))
        rw, rh = w_rect * s, h_rect * s
        x0, y0 = (W - rw) / 2, (H - rh) / 2
        c.create_rectangle(x0, y0, x0 + rw, y0 + rh, outline=self.palette["accent"], width=2,
                           fill=lerp_hex(self.palette["decor"], "#ffffff", 0.5))
        c.create_text(W / 2, 22, text=f"Rectangle {w_rect} × {h_rect}", font=("Helvetica", 11), fill=self.palette["muted"])

    def draw_triangle_angles(self, a, b):
        c = self.explain_canvas; W, H = 620, 210
        c.create_rectangle(1, 1, W - 1, H - 1, outline=self.palette["border"])
        p1 = (90, 170); p2 = (520, 170); p3 = (300, 50)
        c.create_polygon(p1, p2, p3, outline=self.palette["accent"], fill=lerp_hex(self.palette["decor"], "#ffffff", 0.6), width=2)
        c.create_text(p1[0] + 30, p1[1] - 20, text=f"{a}°", font=("Helvetica", 11), fill=self.palette["fg"])
        c.create_text(p2[0] - 30, p2[1] - 20, text=f"{b}°", font=("Helvetica", 11), fill=self.palette["fg"])
        c.create_text(p3[0], p3[1] + 20, text="?", font=("Helvetica", 14, "bold"), fill="#ef4444")
        c.create_text(W / 2, 22, text="Triangle angles add to 180°", font=("Helvetica", 10), fill=self.palette["muted"])

    def draw_right_triangle(self, a, b):
        c = self.explain_canvas; W, H = 620, 210
        c.create_rectangle(1, 1, W - 1, H - 1, outline=self.palette["border"])
        scale = 10
        ax = 130; ay = 170
        bx = ax + a * scale; by = ay
        cx = ax; cy = ay - b * scale
        c.create_polygon((ax, ay), (bx, by), (cx, cy),
                         outline=self.palette["accent"], fill=lerp_hex(self.palette["decor"], "#ffffff", 0.6), width=2)
        c.create_text((ax + bx) / 2, ay + 14, text=str(a), font=("Helvetica", 11), fill=self.palette["fg"])
        c.create_text(ax - 14, (ay + cy) / 2, text=str(b), font=("Helvetica", 11), fill=self.palette["fg"])
        c.create_text((bx + cx) / 2 + 10, (by + cy) / 2 - 10, text="c", font=("Helvetica", 12, "bold"), fill="#ef4444")
        c.create_text(W / 2, 22, text="Right triangle (Pythagorean)", font=("Helvetica", 10), fill=self.palette["muted"])

    def draw_line_graph(self, a, b):
        c = self.explain_canvas; W, H = 620, 210; pad = 40
        c.create_rectangle(1, 1, W - 1, H - 1, outline=self.palette["border"])
        c.create_line(pad, H - pad, W - pad, H - pad, width=2)
        c.create_line(pad, pad, pad, H - pad, width=2)
        prev = None
        for x in [-4, -2, 0, 2, 4]:
            y = a * x + b
            X = pad + (x + 5) * (W - 2 * pad) / 10
            Y = H - pad - (y + 10) * (H - 2 * pad) / 20
            c.create_oval(X - 2, Y - 2, X + 2, Y + 2, fill=self.palette["accent"], outline="")
            if prev: c.create_line(prev[0], prev[1], X, Y, fill=self.palette["accent"], width=2)
            prev = (X, Y)
        c.create_text(W / 2, 20, text=f"Graph of y = {a}x + {b}", font=("Helvetica", 10), fill=self.palette["muted"])

    def draw_coins(self, q, d, n, p):
        c = self.explain_canvas; W, H = 620, 210
        c.create_rectangle(1, 1, W - 1, H - 1, outline=self.palette["border"])
        x, y = 40, 60
        def coin(value, count, color):
            nonlocal x, y
            r = 18
            for _ in range(min(count, 10)):
                c.create_oval(x - r, y - r, x + r, y + r, fill=color, outline=self.palette["fg"])
                c.create_text(x, y, text=str(value), font=("Helvetica", 10), fill="#111")
                x += 44
                if x > W - 50:
                    x = 40; y += 44
        c.create_text(W/2, 26, text="Coin pile (labels are cents)", font=("Helvetica", 10), fill=self.palette["muted"])
        coin(25, q, "#f5f5f4")
        coin(10, d, "#e2e8f0")
        coin(5,  n, "#d1d5db")
        coin(1,  p, "#e5e7eb")

    def draw_clock(self, t_minutes, label):
        c = self.explain_canvas; W, H = 620, 210
        c.create_rectangle(1, 1, W - 1, H - 1, outline=self.palette["border"])
        cx, cy = 180, 110; r = 70
        c.create_oval(cx - r, cy - r, cx + r, cy + r, outline=self.palette["fg"], width=2)
        for i in range(12):
            ang = math.radians(i * 30)
            x1 = cx + (r - 8) * math.sin(ang)
            y1 = cy - (r - 8) * math.cos(ang)
            x2 = cx + r * math.sin(ang)
            y2 = cy - r * math.cos(ang)
            c.create_line(x1, y1, x2, y2, fill=self.palette["fg"])
        h = (t_minutes // 60) % 12
        m = t_minutes % 60
        ang_m = math.radians(m * 6)
        ang_h = math.radians((h * 30) + (m * 0.5))
        c.create_line(cx, cy, cx + (r - 14) * math.sin(ang_m), cy - (r - 14) * math.cos(ang_m),
                      width=2, fill=self.palette["accent"])
        c.create_line(cx, cy, cx + (r - 30) * math.sin(ang_h), cy - (r - 30) * math.cos(ang_h),
                      width=4, fill=self.palette["decor"])
        c.create_text(cx, cy + r + 18, text=minutes_to_hhmm(t_minutes), font=("Helvetica", 11))
        c.create_text(W - 120, 30, text=label, font=("Helvetica", 10), fill=self.palette["muted"])

    def draw_two_clocks(self, t1, t2):
        c = self.explain_canvas; W, H = 620, 210
        c.create_rectangle(1, 1, W - 1, H - 1, outline=self.palette["border"])
        def one(cx, cy, t):
            r = 62
            c.create_oval(cx - r, cy - r, cx + r, cy + r, outline=self.palette["fg"], width=2)
            for i in range(12):
                ang = math.radians(i * 30)
                x1 = cx + (r - 7) * math.sin(ang)
                y1 = cy - (r - 7) * math.cos(ang)
                x2 = cx + r * math.sin(ang)
                y2 = cy - r * math.cos(ang)
                c.create_line(x1, y1, x2, y2, fill=self.palette["fg"])
            h = (t // 60) % 12; m = t % 60
            ang_m = math.radians(m * 6)
            ang_h = math.radians((h * 30) + (m * 0.5))
            c.create_line(cx, cy, cx + (r - 12) * math.sin(ang_m), cy - (r - 12) * math.cos(ang_m),
                          width=2, fill=self.palette["accent"])
            c.create_line(cx, cy, cx + (r - 28) * math.sin(ang_h), cy - (r - 28) * math.cos(ang_h),
                          width=4, fill=self.palette["decor"])
            c.create_text(cx, cy + r + 14, text=minutes_to_hhmm(t), font=("Helvetica", 10))
        one(180, 105, t1); one(440, 105, t2)
        c.create_text(W/2, 26, text="Start    →    End", font=("Helvetica", 11), fill=self.palette["muted"])

    def render_visual(self, subject, text):
        self.clear_visual()
        try:
            if subject.startswith("Money"):
                ns = nums_in(text)
                if "Coin Total" in subject and len(ns) >= 4:
                    q, d, n, p = ns[:4]
                    self.draw_coins(q, d, n, p)
                else:
                    c = self.explain_canvas; W, H = 620, 210
                    c.create_rectangle(1, 1, W - 1, H - 1, outline=self.palette["border"])
                    c.create_text(W/2, H/2, text="Add coin values or compute change in cents.",
                                  font=("Helvetica", 12), fill=self.palette["muted"])
            elif subject.startswith("Clock — Minutes Between"):
                subj, t1, t2 = getattr(self, "_clock_extra", (subject, None, None))
                if t1 is not None and t2 is not None:
                    self.draw_two_clocks(t1, t2)
                else:
                    self.draw_clock(8*60+0, "Analog preview")
            elif subject.startswith("Clock — Add Minutes"):
                subj, t1, _ = getattr(self, "_clock_extra", (subject, None, None))
                if t1 is not None:
                    self.draw_clock(t1, "Start time")
                else:
                    self.draw_clock(9*60+15, "Start time")
            elif subject.startswith("Clock — Angle"):
                subj, t1, _ = getattr(self, "_clock_extra", (subject, None, None))
                if t1 is not None:
                    self.draw_clock(t1, "Angle at this time")
                else:
                    self.draw_clock(3*60+30, "Angle at this time")
            else:
                ns = nums_in(text)
                if subject in ["Addition", "Subtraction", "Integers (+/−)"] and len(ns) >= 2:
                    self.draw_number_line(ns[0], ns[1])
                elif subject in ["Multiplication", "Division"] and len(ns) >= 2:
                    self.draw_number_line(ns[0], ns[1])
                elif subject in ["Area (rect/tri)"] and len(ns) >= 2:
                    self.draw_rect_area(ns[0], ns[1])
                elif subject in ["Angles (sum)"] and len(ns) >= 2:
                    self.draw_triangle_angles(ns[0], ns[1])
                elif subject in ["Pythagorean (int)"] and len(ns) >= 2:
                    self.draw_right_triangle(ns[0], ns[1])
                elif subject in ["Linear Eq (solve x)", "Evaluate Expr", "Functions (f(x))"]:
                    m = re.search(r"(-?\d+)x\s*\+\s*(-?\d+)", text)
                    if m:
                        a, b = int(m.group(1)), int(m.group(2))
                        self.draw_line_graph(a, b)
                else:
                    c = self.explain_canvas; W, H = 620, 210
                    c.create_rectangle(1, 1, W - 1, H - 1, outline=self.palette["border"])
                    c.create_text(W / 2, H / 2,
                                  text="Think step by step.\nUse the hints shown after an incorrect try.",
                                  font=("Helvetica", 11), fill=self.palette["muted"])
        except Exception:
            pass

    # ---------- transient overlay ----------
    def _clear_transient(self):
        for j in self._transient_jobs:
            try: self.root.after_cancel(j)
            except Exception: pass
        self._transient_jobs.clear()
        if self._transient is not None:
            try: self._transient.destroy()
            except Exception: pass
            self._transient = None

    def show_transient(self, text, color=None, hold_ms=3000, fade_ms=600):
        """Show mid-screen message for 3s then fade away."""
        self._clear_transient()
        if color is None: color = self.palette["accent"]
        self._transient = tk.Label(self.card, text=text, font=("Helvetica", 16, "bold"),
                                   bg=self.palette["card"], fg=color)
        self._transient.place(relx=0.5, rely=0.36, anchor="c")

        def start_fade():
            steps = 12
            bg = self.palette["card"]
            for i in range(steps + 1):
                t = i / steps
                newc = lerp_hex(color, bg, t)
                self._transient_jobs.append(self.root.after(int(i * fade_ms / steps),
                                                            lambda c=newc: self._transient.configure(fg=c)))
            # finally remove
            self._transient_jobs.append(self.root.after(fade_ms + 20, self._clear_transient))

        self._transient_jobs.append(self.root.after(hold_ms, start_fade))

    # ---------- quiz flow ----------
    def show_question(self):
        try:
            self.stop_loading_animation()
            if self.current_q < len(self.questions):
                text, _, subj, _, _ = self.questions[self.current_q]
                if not text: text = "Compute the value:"
                
                # Create the full question text
                full_text = f"Subject: {subj}  —  Q{self.current_q + 1}:  {text}"
                
                # Dynamically adjust font size based on text length
                text_length = len(full_text)
                if text_length > 120:
                    font_size = 14
                elif text_length > 90:
                    font_size = 16
                elif text_length > 60:
                    font_size = 18
                else:
                    font_size = 20
                
                # Update the label with appropriate font size and text
                self.question_label.config(
                    text=full_text,
                    font=("Helvetica", font_size, "bold")
                )
                
                self.render_visual(subj, text)
                self.answer_entry.delete(0, tk.END)
                self.feedback_label.config(text="", fg=self.palette["muted"])
                self.attempts = 0
                self.answer_entry.focus_set()
            else:
                self.end_quiz()
        except Exception as e:
            # Debug: show the actual error
            error_msg = f"Error loading question: {str(e)}"
            self.question_label.config(text=error_msg)
            print(f"Question loading error: {e}")  # Debug print
            self.root.after(200, self.show_question)

    def parse_user_answer(self, expected_kind):
        raw = self.answer_entry.get().strip()
        if expected_kind == "time":
            m = parse_time_str(raw)
            if m is None:
                return None, "Enter time as HH:MM (24-hour) or like 7:35 pm."
            return m, None
        if raw == "":
            return None, "Type your answer, then press Enter."
        try:
            return int(raw), None
        except ValueError:
            return None, "Enter a whole number for this one."

    def _award_and_advance(self, msg, color):
        # Show the mid-screen message for 3s then fade; move to next question afterward.
        self.show_transient(msg, color=color, hold_ms=3000, fade_ms=700)
        self.current_q += 1
        self.root.after(3400, self.show_question)  # 3.4s total before next

    def check_answer(self):
        text, correct, subj, hints, kind = self.questions[self.current_q]
        ans, err = self.parse_user_answer(kind)
        if ans is None:
            self.feedback_label.config(text=err, fg="#ef4444" if "number" in (err or "") else self.palette["muted"])
            return

        is_correct = (ans == correct)
        if is_correct:
            # stats
            self.subject_stats[subj]["attempts"] += 1
            self.subject_stats[subj]["solved"] += 1
            if self.attempts == 0:
                self.subject_stats[subj]["first_try"] += 1
            self.correct_count += 1

            # scoring: 8 points for 1st try correct, then decreases
            if self.attempts == 0:
                points = 8
            elif self.attempts == 1:
                points = 6
            elif self.attempts == 2:
                points = 4
            else:
                points = 2
            
            self.points_total += points
            self.per_q_points[self.current_q] = points

            # Color-coded feedback based on attempt number
            if self.attempts == 0:
                msg = f"Perfect! +{points} points (first try)"
                color = "#22c55e"  # Green
                progress_color = "green"
            elif self.attempts == 1:
                msg = f"Nice! +{points} points (second try)"
                color = "#eab308"  # Yellow
                progress_color = "yellow"
            elif self.attempts == 2:
                msg = f"Got it! +{points} points (third try)"
                color = "#f97316"  # Orange
                progress_color = "orange"
            else:
                msg = f"Correct! +{points} points"
                color = "#22c55e"  # Green
                progress_color = "green"
                
            if PIL_OK:
                self.set_progress(self.current_q, "rainbow")
            else:
                self.set_progress(self.current_q, progress_color)
                
            self._award_and_advance(msg, color)
        else:
            self.attempts += 1
            # Deduct 2 points for wrong answer
            self.points_total = max(0, self.points_total - 2)
            
            if self.attempts <= 3:
                if self.attempts == 1 and len(hints) >= 1:
                    self.feedback_label.config(text=f"Incorrect. -2 points. Hint: {hints[0]}", fg="#eab308")  # Yellow
                elif self.attempts == 2 and len(hints) >= 2:
                    self.feedback_label.config(text=f"Incorrect. -2 points. Hint: {hints[1]}", fg="#f97316")  # Orange
                elif self.attempts == 3:
                    self.feedback_label.config(text="Incorrect. -2 points. Last chance!", fg="#f97316")  # Orange
                else:
                    self.feedback_label.config(text="Incorrect. -2 points. Try again.", fg="#eab308")  # Yellow
            else:
                self.give_up()

    def give_up(self):
        text, correct, subj, _, kind = self.questions[self.current_q]
        self.set_progress(self.current_q, "red")
        # stats
        self.subject_stats[subj]["attempts"] += 1
        self.subject_stats[subj]["giveups"] += 1
        # points = 0 on give-up
        self.per_q_points[self.current_q] = 0

        if kind == "time": corr = minutes_to_hhmm(correct)
        else: corr = str(correct)

        self._award_and_advance(f"Failed. 0 points. Correct: {corr}", "#ef4444")  # Red

    # ---------- progress ----------
    def set_progress(self, idx, status):
        if idx >= len(self.progress_labels): return
        lbl = self.progress_labels[idx]
        if PIL_OK:
            if status == "red": lbl.config(image=self.dot_red)
            elif status == "yellow": lbl.config(image=self.dot_yellow)
            elif status == "green": lbl.config(image=self.dot_green)
            elif status == "rainbow":
                if not self._rb_frames: self._rb_frames = self.load_gif_frames("rainbow.gif", 14)
                if self._rb_frames:
                    cycle = itertools.cycle(self._rb_frames)
                    def spin():
                        frame = next(cycle); lbl.config(image=frame); lbl.after(self._rb_delay, spin)
                    spin()
                else:
                    lbl.config(image=self.dot_green)
        else:
            if isinstance(lbl, tk.Canvas):
                size = int(lbl["width"])
                if status == "rainbow":
                    colors = ["#ef4444", "#f97316", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"]
                    it = itertools.cycle(colors)
                    def flash():
                        c = next(it); lbl.delete("all")
                        lbl.create_oval(1, 1, size - 1, size - 1, fill=c, outline="")
                        lbl.after(180, flash)
                    flash()
                else:
                    color = {"red": "#ef4444", "yellow": "#f59e0b", "green": "#22c55e"}.get(status, "#22c55e")
                    lbl.delete("all"); lbl.create_oval(1, 1, size - 1, size - 1, fill=color, outline="")

    # ---------- end ----------
    def end_quiz(self):
        # compute recommendations (worst half of attempted subjects)
        recs = []
        for subj, s in self.subject_stats.items():
            if s["attempts"] == 0: continue
            rate = s["solved"] / s["attempts"]
            recs.append((rate, subj, s))
        recs.sort(key=lambda t: t[0])  # worst first
        k = max(1, len(recs) // 2) if recs else 0
        worst_subjects = [name for _, name, _ in recs[:k]]

        # destroy all but footer
        for w in self.root.winfo_children():
            if w is self.footer:
                continue
            w.destroy()

        self.header = tk.Frame(self.root, height=58); self.header.pack(fill="x", side="top")
        self.header_title = tk.Label(self.header, text="Math Practice", font=("Helvetica", 18, "bold"), fg="#ffffff")
        self.header_title.pack(padx=24, pady=10, anchor="w")
        self.hero = tk.Frame(self.root); self.hero.pack(fill="x")
        self.banner = tk.Canvas(self.hero, width=1040, height=100, highlightthickness=0, bd=0)
        self.banner.pack(fill="x")
        # Force canvas to update its size before drawing
        self.banner.update_idletasks()
        self.draw_gradient(self.banner, self.palette["accent"], darken(self.palette["accent"], 0.4))

        self.card = tk.Frame(self.root, bd=1, relief="solid", highlightthickness=1)
        self.card.place(relx=0.5, rely=0.55, anchor="c", width=640, height=420)
        title = tk.Label(self.card, text="All done! 🎉", font=("Helvetica", 24, "bold")); title.pack(pady=(20, 8))

        total_possible = self.num_questions * 10
        points_lbl = tk.Label(self.card, text=f"Points: {self.points_total}/{total_possible}",
                              font=("Helvetica", 14, "bold"))
        points_lbl.pack(pady=(0, 4))
        score = tk.Label(self.card, text=f"Correct: {self.correct_count}/{self.num_questions}",
                         font=("Helvetica", 12))
        score.pack(pady=(0, 8))

        # recommendations only for General / Multiple
        mode = self.focus_var.get()
        if mode in ("General", "Multiple Subjects"):
            if worst_subjects:
                msg = "Suggestions (focus next): " + ", ".join(worst_subjects)
            else:
                msg = "Great balance! Try harder difficulty or new topics."
        else:
            msg = "Tip: Recommendations appear only in General or Multiple Subjects mode."
        rec = tk.Label(self.card, text=msg, font=("Helvetica", 11))
        rec.pack(pady=(0, 16))

        btn_row = tk.Frame(self.card); btn_row.pack()
        self.start_btn = tk.Button(btn_row, text="Restart", command=self.setup_start_screen, width=16, cursor="hand2",
                                  bg=self.palette["accent"], fg="white", relief="flat", bd=1,
                                  activebackground=darken(self.palette["accent"], 0.2), activeforeground="white")
        self.start_btn.pack()
        self.apply_palette_now([self.card, title, points_lbl, score, rec, btn_row])
        # Ensure button visibility after palette application  
        self.start_btn.configure(fg="#374151")

    # ---------- util ----------
    def clear_window(self, keep_footer=False):
        # Clear button references to prevent styling errors
        for attr in ("start_btn", "check_btn", "giveup_btn"):
            if hasattr(self, attr):
                delattr(self, attr)
        
        # Clear arrow references
        for attr in ('theme_arrow', 'grade_arrow', 'focus_arrow', 'subj_arrow', 'diff_arrow'):
            if hasattr(self, attr):
                delattr(self, attr)
        
        # Clear rounded combobox canvas references
        for attr in ('theme_bg_canvas', 'theme_arrow_canvas', 'grade_bg_canvas', 'grade_arrow_canvas',
                    'focus_bg_canvas', 'focus_arrow_canvas', 'subj_bg_canvas', 'subj_arrow_canvas',
                    'diff_bg_canvas', 'diff_arrow_canvas'):
            if hasattr(self, attr):
                delattr(self, attr)
        
        for w in list(self.root.winfo_children()):
            if keep_footer and getattr(self, "footer", None) is w:
                continue
            w.destroy()


if __name__ == "__main__":
    root = tk.Tk()
    app = MathQuizApp(root)
    root.mainloop()
