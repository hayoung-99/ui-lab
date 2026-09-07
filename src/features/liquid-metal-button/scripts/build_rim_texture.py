"""
레퍼런스 영상의 프레임들에서 링 둘레의 색을 뽑아 "둘레 × 시간" 텍스처를 만든다.

  - 가로(x): 둘레 위치 0..1. 왼쪽 위 모서리(윗변 시작)에서 시계 방향. MetalRim 의 uv.x 와 같다.
  - 세로(y): 시간. 한 주기만큼의 프레임을 위에서 아래로 쌓는다.
  - 세 장을 세로로 이어 붙인다: [안쪽 줄][중간 줄][바깥 줄] (링 폭 방향 세 위치).

주기는 첫 프레임과 가장 닮은 프레임을 2.5~4.5초 사이에서 찾아 정한다.
"""
import glob, math, re, sys
from PIL import Image

SRC = sys.argv[1]      # 프레임 폴더
OUT = sys.argv[2]      # 출력 PNG
N = 512                # 둘레 샘플 수
# 영상 속 버튼 링의 바깥 경계 (앞서 픽셀 스캔으로 잰 값)
x0, x1, y0, y1 = 58.5, 581.0, 47.5, 211.0   # 아랫변은 링(205~210) 바로 아래 그림자를 링으로 잘못 잡지 않도록 211
INSETS = [4.5, 3.0, 1.5]   # 안쪽 → 바깥 (바깥 경계에서 안으로 들어간 px)

r = (y1 - y0) / 2
cy = (y0 + y1) / 2
lx, rx = x0 + r, x1 - r
L = rx - lx
P = 2 * L + 2 * math.pi * r


def point(t, inset):
    s = t * P
    if s < L:
        return lx + s, y0 + inset
    s -= L
    if s < math.pi * r:
        a = -math.pi / 2 + s / r
        return rx + (r - inset) * math.cos(a), cy + (r - inset) * math.sin(a)
    s -= math.pi * r
    if s < L:
        return rx - s, y1 - inset
    s -= L
    a = math.pi / 2 + s / r
    return lx + (r - inset) * math.cos(a), cy + (r - inset) * math.sin(a)


def frame_time(path):
    return float(re.search(r"_(\d+\.\d+)s\.png$", path).group(1))


files = sorted(glob.glob(f"{SRC}/f_*.png"), key=frame_time)
times = [frame_time(f) for f in files]
print(f"{len(files)} frames, {times[0]:.3f}..{times[-1]:.3f}s")

coords = [[point(i / N, ins) for i in range(N)] for ins in INSETS]


def sample(px, x, y):
    """양선형 보간."""
    xi, yi = int(x), int(y)
    fx, fy = x - xi, y - yi
    c00 = px[xi, yi]; c10 = px[xi + 1, yi]; c01 = px[xi, yi + 1]; c11 = px[xi + 1, yi + 1]
    w00, w10, w01, w11 = (1 - fx) * (1 - fy), fx * (1 - fy), (1 - fx) * fy, fx * fy
    return tuple(c00[k] * w00 + c10[k] * w10 + c01[k] * w01 + c11[k] * w11 for k in range(3))


rows = []  # rows[frame][band] = [(r,g,b)] * N
for f in files:
    px = Image.open(f).convert("RGB").load()
    rows.append([[sample(px, x, y) for (x, y) in band] for band in coords])
print("sampled")


def frame_diff(a, b):
    tot = 0.0
    for band_a, band_b in zip(a, b):
        for ca, cb in zip(band_a, band_b):
            tot += abs(ca[0] - cb[0]) + abs(ca[1] - cb[1]) + abs(ca[2] - cb[2])
    return tot / (3 * N * 3)


dt = (times[-1] - times[0]) / (len(times) - 1)
lo, hi = int(2.5 / dt), min(int(4.5 / dt), len(rows))
best_diff, period_frames = min((frame_diff(rows[i], rows[0]), i) for i in range(lo, hi))
period_s = period_frames * dt
print(f"period ≈ {period_frames} frames = {period_s:.3f}s (mean diff {best_diff:.2f})")

T = period_frames
img = Image.new("RGB", (N, 3 * T))
out = img.load()
for b in range(3):
    for t in range(T):
        row = rows[t][b]
        for i in range(N):
            c = row[i]
            out[i, b * T + t] = (int(round(c[0])), int(round(c[1])), int(round(c[2])))
img.save(OUT, optimize=True)
print(f"wrote {OUT}: {N}x{3*T} (T={T} rows per band)")
print(f"META period_frames={T} period_s={period_s:.4f}")
