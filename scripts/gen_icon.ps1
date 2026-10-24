Add-Type -AssemblyName System.Drawing
$root = Split-Path -Parent $PSScriptRoot
$res = Join-Path $root 'android\app\src\main\res'

function New-Star($cx, $cy, $ro, $ri) {
  $pts = New-Object 'System.Drawing.PointF[]' 10
  for ($i = 0; $i -lt 10; $i++) {
    $a = [Math]::PI / 180 * (-90 + 36 * $i)
    $r = if ($i % 2 -eq 0) { $ro } else { $ri }
    $pts[$i] = New-Object System.Drawing.PointF(($cx + $r * [Math]::Cos($a)), ($cy + $r * [Math]::Sin($a)))
  }
  return ,$pts
}

function Draw-Icon($S, $mode) {
  $bmp = New-Object System.Drawing.Bitmap($S, $S, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = 'AntiAlias'
  $g.Clear([System.Drawing.Color]::Transparent)
  $cx = $S / 2.0; $cy = $S / 2.0
  if ($mode -ne 'fg') {
    $rect = New-Object System.Drawing.RectangleF(0, 0, $S, $S)
    $bg = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, [System.Drawing.Color]::FromArgb(255, 239, 68, 90), [System.Drawing.Color]::FromArgb(255, 127, 29, 29), 60.0)
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    if ($mode -eq 'round') { $path.AddEllipse(0, 0, $S, $S) }
    else { $rr = $S * 0.22; $path.AddArc(0, 0, $rr * 2, $rr * 2, 180, 90); $path.AddArc($S - $rr * 2, 0, $rr * 2, $rr * 2, 270, 90); $path.AddArc($S - $rr * 2, $S - $rr * 2, $rr * 2, $rr * 2, 0, 90); $path.AddArc(0, $S - $rr * 2, $rr * 2, $rr * 2, 90, 90); $path.CloseFigure() }
    $g.FillPath($bg, $path)
    $ringPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(110, 253, 224, 71), [float]($S * 0.02))
    $g.DrawEllipse($ringPen, [float]($S * 0.07), [float]($S * 0.07), [float]($S * 0.86), [float]($S * 0.86))
    $R = $S * 0.36
  } else { $R = $S * 0.29 }
  # ombre
  $sh = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(90, 0, 0, 0))
  $g.FillEllipse($sh, [float]($cx - $R), [float]($cy - $R + $R * 0.07), [float]($R * 2), [float]($R * 2))
  # pièce dorée
  $coinRect = New-Object System.Drawing.RectangleF([float]($cx - $R), [float]($cy - $R), [float]($R * 2), [float]($R * 2))
  $coin = New-Object System.Drawing.Drawing2D.LinearGradientBrush($coinRect, [System.Drawing.Color]::FromArgb(255, 254, 240, 138), [System.Drawing.Color]::FromArgb(255, 217, 119, 6), 55.0)
  $g.FillEllipse($coin, $coinRect)
  $rim = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 180, 83, 9), [float]($R * 0.07))
  $g.DrawEllipse($rim, $coinRect)
  # disque blanc, croissant rouge, étoile rouge (emblème tunisien)
  $white = [System.Drawing.Brushes]::White
  $red = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 220, 38, 38))
  $wr = $R * 0.74
  $g.FillEllipse($white, [float]($cx - $wr), [float]($cy - $wr), [float]($wr * 2), [float]($wr * 2))
  $c1 = $R * 0.54
  $g.FillEllipse($red, [float]($cx - $R * 0.05 - $c1), [float]($cy - $c1), [float]($c1 * 2), [float]($c1 * 2))
  $c2 = $R * 0.43
  $g.FillEllipse($white, [float]($cx + $R * 0.07 - $c2), [float]($cy - $c2), [float]($c2 * 2), [float]($c2 * 2))
  $star = New-Star ($cx + $R * 0.12) $cy ($R * 0.24) ($R * 0.10)
  $g.FillPolygon($red, $star)
  $g.Dispose()
  return $bmp
}

$dens = @{ 'mdpi' = 1.0; 'hdpi' = 1.5; 'xhdpi' = 2.0; 'xxhdpi' = 3.0; 'xxxhdpi' = 4.0 }
foreach ($d in $dens.Keys) {
  $k = $dens[$d]
  $dir = Join-Path $res "mipmap-$d"
  $items = @(@('ic_launcher', 48, 'full'), @('ic_launcher_round', 48, 'round'), @('ic_launcher_foreground', 108, 'fg'))
  foreach ($it in $items) {
    $size = [int]($it[1] * $k)
    $b = Draw-Icon $size $it[2]
    $b.Save((Join-Path $dir ($it[0] + '.png')), [System.Drawing.Imaging.ImageFormat]::Png)
    $b.Dispose()
  }
}
$big = Draw-Icon 1024 'full'
$big.Save((Join-Path $root 'assets\icon.png'), [System.Drawing.Imaging.ImageFormat]::Png)
$big.Dispose()
Write-Output 'icons ok'
