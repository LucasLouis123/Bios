<?php
$viewFile = 'views.txt';

// Check if the file exists
if (!file_exists($viewFile)) {
    file_put_contents($viewFile, '0');
}

// Increment the view count
$views = (int)file_get_contents($viewFile);
$views++;
file_put_contents($viewFile, $views);

// Return the view count
echo $views;
?>
