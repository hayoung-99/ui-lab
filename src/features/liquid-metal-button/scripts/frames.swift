import AVFoundation
import AppKit

// usage: frames <video> <outdir> <count>
let args = CommandLine.arguments
let url = URL(fileURLWithPath: args[1])
let outDir = args[2]
let count = Int(args[3]) ?? 12

let asset = AVURLAsset(url: url)
let dur = CMTimeGetSeconds(asset.duration)
let track = asset.tracks(withMediaType: .video).first!
let size = track.naturalSize
print("duration \(dur)s size \(size.width)x\(size.height) fps \(track.nominalFrameRate)")

let gen = AVAssetImageGenerator(asset: asset)
gen.appliesPreferredTrackTransform = true
gen.requestedTimeToleranceBefore = .zero
gen.requestedTimeToleranceAfter = .zero

for i in 0..<count {
  let t = dur * Double(i) / Double(count)
  let time = CMTime(seconds: t, preferredTimescale: 600)
  do {
    let cg = try gen.copyCGImage(at: time, actualTime: nil)
    let rep = NSBitmapImageRep(cgImage: cg)
    let data = rep.representation(using: .png, properties: [:])!
    let name = String(format: "%@/f_%02d_%.2fs.png", outDir, i, t)
    try data.write(to: URL(fileURLWithPath: name))
    print("wrote \(name)")
  } catch {
    print("fail at \(t): \(error)")
  }
}
