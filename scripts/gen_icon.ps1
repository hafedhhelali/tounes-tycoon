Add-Type -AssemblyName System.Drawing
$root = Split-Path -Parent $PSScriptRoot
$res = Join-Path $root 'android\app\src\main\res'

function New-Hexagon($cx, $cy, $r) {
  $pts = New-Object 'System.Drawing.PointF[]' 6
  for ($i = 0; $i -lt 6; $i++) {
    $a = [Math]::PI / 180 * (-90 + 60 * $i)
    $pts[$i] = New-Object System.Drawing.PointF([float]($cx + $r * [Math]::Cos($a)), [float]($cy + $r * [Math]::Sin($a)))
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
    # Fond Futuriste Finance & Business (Obsidienne & Bleu Nuit Fintech — ZÉRO DRAPEAU)
    $bg = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, [System.Drawing.Color]::FromArgb(255, 6, 11, 22), [System.Drawing.Color]::FromArgb(255, 12, 28, 52), 55.0)
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    if ($mode -eq 'round') {
      $path.AddEllipse(0, 0, $S, $S)
    } else {
      $rr = $S * 0.22
      $path.AddArc(0, 0, $rr * 2, $rr * 2, 180, 90)
      $path.AddArc($S - $rr * 2, 0, $rr * 2, $rr * 2, 270, 90)
      $path.AddArc($S - $rr * 2, $S - $rr * 2, $rr * 2, $rr * 2, 0, 90)
      $path.AddArc(0, $S - $rr * 2, $rr * 2, $rr * 2, 90, 90)
      $path.CloseFigure()
    }
    $g.FillPath($bg, $path)
    $ringPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(140, 16, 185, 129), [float]($S * 0.02))
    $g.DrawEllipse($ringPen, [float]($S * 0.07), [float]($S * 0.07), [float]($S * 0.86), [float]($S * 0.86))
    $R = $S * 0.37
  } else {
    $R = $S * 0.31
  }

  # 1. Bouclier Hexagonal Futuriste en Obsidienne & Or 24K
  $hexOuter = New-Hexagon $cx $cy $R
  $hexBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(245, 15, 23, 42))
  $g.FillPolygon($hexBrush, $hexOuter)
  $hexPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 245, 158, 11), [float]([Math]::Max(1.5, $R * 0.09)))
  $g.DrawPolygon($hexPen, $hexOuter)

  $hexInner = New-Hexagon $cx $cy ($R * 0.86)
  $cyanPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(180, 56, 189, 248), [float]([Math]::Max(1.0, $R * 0.035)))
  $g.DrawPolygon($cyanPen, $hexInner)

  # 2. Trois Barres Financières Croissantes (Skyscraper / Bull Market)
  $bw = [float]($R * 0.22)
  $baseY = [float]($cy + $R * 0.42)

  # Barre 1 (Cyan)
  $h1 = [float]($R * 0.38)
  $x1 = [float]($cx - $R * 0.44)
  $b1 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 14, 165, 233))
  $g.FillRectangle($b1, $x1, [float]($baseY - $h1), $bw, $h1)

  # Barre 2 (Émeraude)
  $h2 = [float]($R * 0.64)
  $x2 = [float]($cx - $bw / 2.0)
  $b2 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 16, 185, 129))
  $g.FillRectangle($b2, $x2, [float]($baseY - $h2), $bw, $h2)

  # Barre 3 (Or 24K)
  $h3 = [float]($R * 0.94)
  $x3 = [float]($cx + $R * 0.22)
  $b3 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 251, 191, 36))
  $g.FillRectangle($b3, $x3, [float]($baseY - $h3), $bw, $h3)

  # 3. Flèche Boursière Ascendante en Or Lumineux
  $arrowPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 254, 240, 138), [float]([Math]::Max(1.8, $R * 0.10)))
  $arrowPen.StartCap = 'Round'
  $arrowPen.EndCap = 'Round'
  $p1 = New-Object System.Drawing.PointF([float]($cx - $R * 0.50), [float]($cy + $R * 0.14))
  $p2 = New-Object System.Drawing.PointF([float]($cx - $R * 0.12), [float]($cy - $R * 0.18))
  $p3 = New-Object System.Drawing.PointF([float]($cx + $R * 0.06), [float]($cy - $R * 0.04))
  $p4 = New-Object System.Drawing.PointF([float]($cx + $R * 0.44), [float]($cy - $R * 0.54))
  $g.DrawLines($arrowPen, @($p1, $p2, $p3, $p4))

  # Pointe de flèche
  $headBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 254, 240, 138))
  $ah1 = New-Object System.Drawing.PointF([float]($cx + $R * 0.48), [float]($cy - $R * 0.58))
  $ah2 = New-Object System.Drawing.PointF([float]($cx + $R * 0.24), [float]($cy - $R * 0.54))
  $ah3 = New-Object System.Drawing.PointF([float]($cx + $R * 0.46), [float]($cy - $R * 0.32))
  $g.FillPolygon($headBrush, @($ah1, $ah2, $ah3))

  # 4. Lingot d'Or de Base
  $barBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 245, 158, 11))
  $g.FillRectangle($barBrush, [float]($cx - $R * 0.50), [float]($baseY + $R * 0.05), [float]($R * 1.0), [float]($R * 0.12))

  $g.Dispose()
  return $bmp
}

function Save-Png($bmp, $outPath) {
  $ms = New-Object System.IO.MemoryStream
  $bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
  [System.IO.File]::WriteAllBytes($outPath, $ms.ToArray())
  $ms.Dispose()
}

$dens = @{ 'mdpi' = 1.0; 'hdpi' = 1.5; 'xhdpi' = 2.0; 'xxhdpi' = 3.0; 'xxxhdpi' = 4.0 }
foreach ($d in $dens.Keys) {
  $k = $dens[$d]
  $dir = Join-Path $res "mipmap-$d"
  $items = @(@('ic_launcher', 48, 'full'), @('ic_launcher_round', 48, 'round'), @('ic_launcher_foreground', 108, 'fg'))
  foreach ($it in $items) {
    $size = [int]($it[1] * $k)
    $b = Draw-Icon $size $it[2]
    Save-Png $b (Join-Path $dir ($it[0] + '.png'))
    $b.Dispose()
  }
}
$big = Draw-Icon 512 'full'
Save-Png $big (Join-Path $root 'assets\icon.png')
Save-Png $big (Join-Path $root 'icon.png')
Save-Png $big (Join-Path $root 'www\icon.png')
$pubIcon = Join-Path $root 'android\app\src\main\assets\public\icon.png'
if (Test-Path (Split-Path -Parent $pubIcon)) {
  Save-Png $big $pubIcon
}
$big.Dispose()
Write-Output 'futuristic finance icons ok'
