# =====================================================================
# Generate 16 Indian E-Commerce JPEG placeholder images for ApnaBazar
# =====================================================================

Add-Type -AssemblyName System.Drawing

$outputDir = "D:\ProgLabProject\frontend\images\products"
if (!(Test-Path $outputDir)) {
    New-Item -ItemType Directory -Force -Path $outputDir
}

$items = @(
    @{ File = "kesar.jpg"; Title = "Kashmiri Shahi Kesar"; Brand = "Kashmir Crown"; Bg = "#451a03"; TextColor = "#fde047"; Category = "Groceries" },
    @{ File = "ghee.jpg"; Title = "Organic A2 Gir Cow Ghee"; Brand = "Amrit Vedic"; Bg = "#78350f"; TextColor = "#fef08a"; Category = "Groceries" },
    @{ File = "tea.jpg"; Title = "Darjeeling First Flush Tea"; Brand = "Makaibari Heritage"; Bg = "#064e3b"; TextColor = "#a7f3d0"; Category = "Groceries" },
    @{ File = "spices.jpg"; Title = "Kerala Malabar Whole Spices"; Brand = "Kerala Spice Co."; Bg = "#7c2d12"; TextColor = "#fed7aa"; Category = "Groceries" },
    @{ File = "saree.jpg"; Title = "Pure Katan Silk Banarasi Saree"; Brand = "Varanasi Bunkar"; Bg = "#064e3b"; TextColor = "#fef08a"; Category = "Ethnic Wear" },
    @{ File = "kurta.jpg"; Title = "Chanderi Embroidered Kurta"; Brand = "Rivaaz Ethno"; Bg = "#701a75"; TextColor = "#f5d0fe"; Category = "Ethnic Wear" },
    @{ File = "jacket.jpg"; Title = "Khadi Raw Silk Nehru Jacket"; Brand = "Swadeshi Craft"; Bg = "#1e293b"; TextColor = "#e2e8f0"; Category = "Ethnic Wear" },
    @{ File = "stole.jpg"; Title = "Kashmiri Wool Pashmina Stole"; Brand = "Pashm Heritage"; Bg = "#831843"; TextColor = "#fbcfe8"; Category = "Ethnic Wear" },
    @{ File = "mixer.jpg"; Title = "Preethi 750W Mixer Grinder"; Brand = "Preethi"; Bg = "#0f172a"; TextColor = "#fdba74"; Category = "Electronics" },
    @{ File = "headphones.jpg"; Title = "boAt Rockerz 550 Headphones"; Brand = "boAt"; Bg = "#18181b"; TextColor = "#f87171"; Category = "Electronics" },
    @{ File = "cooktop.jpg"; Title = "Havells Smart Induction Cooktop"; Brand = "Havells"; Bg = "#09090b"; TextColor = "#38bdf8"; Category = "Electronics" },
    @{ File = "smartwatch.jpg"; Title = "Noise ColorFit Calling Watch"; Brand = "Noise"; Bg = "#1e3a8a"; TextColor = "#93c5fd"; Category = "Electronics" },
    @{ File = "diya.jpg"; Title = "Solid Brass Peacock Diya Lamp"; Brand = "Temple Arts"; Bg = "#78350f"; TextColor = "#fef08a"; Category = "Home & Puja" },
    @{ File = "razai.jpg"; Title = "Jaipuri Block-Print Razai"; Brand = "Jaipur Loom"; Bg = "#831843"; TextColor = "#fecdd3"; Category = "Home & Puja" },
    @{ File = "kumkumadi.jpg"; Title = "Kumkumadi Ayurvedic Fluid"; Brand = "Forest Essentials"; Bg = "#451a03"; TextColor = "#fde047"; Category = "Ayurveda" },
    @{ File = "sandalwood.jpg"; Title = "Mysore Sandalwood & Agarbatti"; Brand = "Mysore Heritage"; Bg = "#78350f"; TextColor = "#fed7aa"; Category = "Ayurveda" }
)

$width = 700
$height = 700

$fontFamily = [System.Drawing.FontFamily]::GenericSansSerif
$brandFont = New-Object System.Drawing.Font($fontFamily, 13, [System.Drawing.FontStyle]::Bold)
$titleFont = New-Object System.Drawing.Font($fontFamily, 22, [System.Drawing.FontStyle]::Bold)
$subFont   = New-Object System.Drawing.Font($fontFamily, 12, [System.Drawing.FontStyle]::Regular)
$hintFont  = New-Object System.Drawing.Font($fontFamily, 11, [System.Drawing.FontStyle]::Italic)

$formatCenter = New-Object System.Drawing.StringFormat
$formatCenter.Alignment = [System.Drawing.StringAlignment]::Center
$formatCenter.LineAlignment = [System.Drawing.StringAlignment]::Center

foreach ($item in $items) {
    $bmp = New-Object System.Drawing.Bitmap($width, $height)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

    $bgColor = [System.Drawing.ColorTranslator]::FromHtml($item.Bg)
    $txtColor = [System.Drawing.ColorTranslator]::FromHtml($item.TextColor)
    $orangeColor = [System.Drawing.ColorTranslator]::FromHtml("#ea580c")
    $whiteColor = [System.Drawing.Color]::White

    # Background
    $bgBrush = New-Object System.Drawing.SolidBrush($bgColor)
    $g.FillRectangle($bgBrush, 0, 0, $width, $height)

    # Decorative Border
    $borderPen = New-Object System.Drawing.Pen($txtColor, 3)
    $g.DrawRectangle($borderPen, 20, 20, ($width - 40), ($height - 40))

    # Inner Frame
    $innerPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(60, 255, 255, 255), 1)
    $g.DrawRectangle($innerPen, 30, 30, ($width - 60), ($height - 60))

    # Top Header Banner
    $bannerBrush = New-Object System.Drawing.SolidBrush($orangeColor)
    $g.FillRectangle($bannerBrush, 40, 50, ($width - 80), 45)
    $whiteBrush = New-Object System.Drawing.SolidBrush($whiteColor)
    $g.DrawString("APNABAZAR • " + $item.Category.ToUpper(), $brandFont, $whiteBrush, ($width / 2), 72, $formatCenter)

    # Middle Center Badge
    $circleBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(40, 255, 255, 255))
    $g.FillEllipse($circleBrush, 225, 175, 250, 250)
    $circlePen = New-Object System.Drawing.Pen($txtColor, 2)
    $g.DrawEllipse($circlePen, 225, 175, 250, 250)

    # Center Info
    $brandBrush = New-Object System.Drawing.SolidBrush($txtColor)
    $g.DrawString($item.Brand.ToUpper(), $brandFont, $brandBrush, ($width / 2), 260, $formatCenter)

    $titleBrush = New-Object System.Drawing.SolidBrush($whiteColor)
    $titleRect = New-Object System.Drawing.RectangleF(70, 310, ($width - 140), 90)
    $g.DrawString($item.Title, $titleFont, $titleBrush, $titleRect, $formatCenter)

    # Bottom Callout Box (Explaining where to replace)
    $boxBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(210, 15, 23, 42))
    $g.FillRectangle($boxBrush, 50, 500, ($width - 100), 140)
    $boxPen = New-Object System.Drawing.Pen($orangeColor, 2)
    $g.DrawRectangle($boxPen, 50, 500, ($width - 100), 140)

    $fileBrush = New-Object System.Drawing.SolidBrush($txtColor)
    $g.DrawString("File: " + $item.File, $brandFont, $fileBrush, ($width / 2), 530, $formatCenter)

    $g.DrawString("You can replace this JPEG anytime by saving your photo as:", $subFont, $whiteBrush, ($width / 2), 565, $formatCenter)

    $hintBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#94a3b8"))
    $g.DrawString("frontend/images/products/" + $item.File, $hintFont, $hintBrush, ($width / 2), 605, $formatCenter)

    # Save as JPEG with 90% quality
    $outPath = Join-Path $outputDir $item.File
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)

    $g.Dispose()
    $bmp.Dispose()
    Write-Output "Created: $($item.File)"
}

Write-Output "All 16 JPEG images generated successfully in $outputDir!"
