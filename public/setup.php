<?php

require __DIR__.'/abc-elektronik/vendor/autoload.php';
$app = require_once __DIR__.'/abc-elektronik/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

echo "Running setup...\n";
$kernel->call('config:cache');
$kernel->call('route:cache');
$kernel->call('view:cache');
$kernel->call('storage:link');
echo "Setup complete!";