Add-Type -AssemblyName System.Drawing

# Create thumbnails directory if it doesn't exist
$thumbnailsDir = "assets\photos\thumbnails"
if (-not (Test-Path $thumbnailsDir)) {
    New-Item -ItemType Directory -Path $thumbnailsDir
}

# Get all jpg files in the photos directory
$photos = Get-ChildItem -Path "assets\photos" -Filter "*.jpg" -File

foreach ($photo in $photos) {
    $thumbnailPath = Join-Path $thumbnailsDir $photo.Name
    
    # Skip if thumbnail already exists
    if (-not (Test-Path $thumbnailPath)) {
        $img = [System.Drawing.Image]::FromFile($photo.FullName)
        
        # Calculate new dimensions (maintaining aspect ratio)
        $ratio = [Math]::Min(400/$img.Width, 300/$img.Height)
        $newWidth = [int]($img.Width * $ratio)
        $newHeight = [int]($img.Height * $ratio)
        
        # Create thumbnail
        $thumbnail = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
        $graphics = [System.Drawing.Graphics]::FromImage($thumbnail)
        $graphics.DrawImage($img, 0, 0, $newWidth, $newHeight)
        
        # Save thumbnail
        $thumbnail.Save($thumbnailPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
        
        # Clean up
        $graphics.Dispose()
        $thumbnail.Dispose()
        $img.Dispose()
        
        Write-Host "Created thumbnail for $($photo.Name)"
    }
}

Write-Host "Thumbnail creation complete!"
