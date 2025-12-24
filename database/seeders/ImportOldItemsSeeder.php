<?php

namespace Database\Seeders;

use App\Models\Item;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ImportOldItemsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Old items data from item.sql
        $oldItems = [
            ['id' => 1, 'name' => 'DAIKIN 1/2 pk FTC15NV', 'unit' => 'set', 'buy_price' => '4042661.0000', 'sell_price' => '4100000.0000', 'is_active' => 1, 'created_at' => '2025-01-03 07:43:26', 'updated_at' => '2025-01-03 07:47:18'],
            ['id' => 2, 'name' => 'Daikin 3/4pk FTC20NV', 'unit' => 'set', 'buy_price' => '4200650.0000', 'sell_price' => '4250000.0000', 'is_active' => 1, 'created_at' => '2025-01-03 07:44:41', 'updated_at' => '2025-01-03 07:47:13'],
            ['id' => 3, 'name' => 'Daikin 1pk FTC25NV', 'unit' => 'set', 'buy_price' => '4395813.0000', 'sell_price' => '4400000.0000', 'is_active' => 1, 'created_at' => '2025-01-03 07:45:37', 'updated_at' => '2025-01-03 07:47:06'],
            ['id' => 4, 'name' => 'Daikin 1 1/2 pk FTC35NV', 'unit' => 'set', 'buy_price' => '5455269.0000', 'sell_price' => '5500000.0000', 'is_active' => 1, 'created_at' => '2025-01-03 07:46:42', 'updated_at' => '2025-01-03 07:46:42'],
            ['id' => 5, 'name' => 'Daikin 2pk FTC50XV', 'unit' => 'set', 'buy_price' => '7267497.0000', 'sell_price' => '7350000.0000', 'is_active' => 1, 'created_at' => '2025-01-03 07:48:13', 'updated_at' => '2025-01-03 07:48:13'],
            ['id' => 6, 'name' => 'Daikin 1/2 pk FTV15CXV', 'unit' => 'set', 'buy_price' => '3698803.0000', 'sell_price' => '3750000.0000', 'is_active' => 1, 'created_at' => '2025-01-03 07:50:33', 'updated_at' => '2025-01-03 07:50:33'],
            ['id' => 7, 'name' => 'Daikin 3/4pk FTV20CXV', 'unit' => 'set', 'buy_price' => '3856792.0000', 'sell_price' => '3950000.0000', 'is_active' => 1, 'created_at' => '2025-01-03 07:52:51', 'updated_at' => '2025-01-03 07:52:51'],
            ['id' => 8, 'name' => 'Daikin 1pk FTV25CXV', 'unit' => 'set', 'buy_price' => '4014781.0000', 'sell_price' => '4100000.0000', 'is_active' => 1, 'created_at' => '2025-01-03 07:55:04', 'updated_at' => '2025-01-03 07:55:04'],
            ['id' => 9, 'name' => 'Daikin 1 1/2 pk FTV35CXV', 'unit' => 'set', 'buy_price' => '5027769.0000', 'sell_price' => '5100000.0000', 'is_active' => 1, 'created_at' => '2025-01-03 07:55:55', 'updated_at' => '2025-01-03 07:55:55'],
            ['id' => 10, 'name' => 'Daikin 2pk FTV50CXV', 'unit' => 'set', 'buy_price' => '6663421.0000', 'sell_price' => '6750000.0000', 'is_active' => 1, 'created_at' => '2025-01-03 07:57:07', 'updated_at' => '2025-01-03 07:57:07'],
            ['id' => 11, 'name' => 'Daikin 2 1/2 pk FTV60CXV', 'unit' => 'set', 'buy_price' => '9451464.0000', 'sell_price' => '9600000.0000', 'is_active' => 1, 'created_at' => '2025-01-03 07:58:14', 'updated_at' => '2025-01-03 07:58:14'],
            ['id' => 12, 'name' => 'Daikin 1/2 pk FTKQ15UVM', 'unit' => 'set', 'buy_price' => '4823313.0000', 'sell_price' => '4850000.0000', 'is_active' => 1, 'created_at' => '2025-01-03 08:00:36', 'updated_at' => '2025-01-03 08:00:36'],
            ['id' => 13, 'name' => 'Daikin 3/4pk FTKQ20UVM', 'unit' => 'set', 'buy_price' => '5027769.0000', 'sell_price' => '5100000.0000', 'is_active' => 1, 'created_at' => '2025-01-03 08:02:27', 'updated_at' => '2025-01-03 08:02:27'],
            ['id' => 14, 'name' => 'Daikin 1pk FTKQ25UVM', 'unit' => 'set', 'buy_price' => '5222932.0000', 'sell_price' => '5250000.0000', 'is_active' => 1, 'created_at' => '2025-01-03 08:03:59', 'updated_at' => '2025-01-03 08:03:59'],
            ['id' => 15, 'name' => 'Daikin 1 1/2 pk FTKQ35UVM', 'unit' => 'set', 'buy_price' => '6598367.0000', 'sell_price' => '6650000.0000', 'is_active' => 1, 'created_at' => '2025-01-03 08:10:31', 'updated_at' => '2025-01-03 08:10:31'],
            ['id' => 16, 'name' => 'Daikin 2pk FTKQ50UVM', 'unit' => 'set', 'buy_price' => '9553692.0000', 'sell_price' => '9700000.0000', 'is_active' => 1, 'created_at' => '2025-01-03 08:11:20', 'updated_at' => '2025-01-03 08:11:20'],
            ['id' => 17, 'name' => 'Daikin 1/2 pk FTP15AV', 'unit' => 'set', 'buy_price' => '3170160.0000', 'sell_price' => '3250000.0000', 'is_active' => 1, 'created_at' => '2025-01-03 08:24:53', 'updated_at' => '2025-01-03 08:24:53'],
            ['id' => 18, 'name' => 'Daikin 1pk FTP25AV', 'unit' => 'set', 'buy_price' => '3566430.0000', 'sell_price' => '3600000.0000', 'is_active' => 1, 'created_at' => '2025-01-10 06:53:37', 'updated_at' => '2025-01-10 06:53:37'],
            ['id' => 19, 'name' => 'GREE 1/2pk 05MOO', 'unit' => 'pcs', 'buy_price' => '3099000.0000', 'sell_price' => '3299000.0000', 'is_active' => 1, 'created_at' => '2025-01-10 08:14:59', 'updated_at' => '2025-07-08 09:12:06'],
            ['id' => 20, 'name' => 'GREE 3/4pk 07MOO', 'unit' => 'set', 'buy_price' => '3609000.0000', 'sell_price' => '3679000.0000', 'is_active' => 0, 'created_at' => '2025-01-10 08:15:34', 'updated_at' => '2025-07-04 11:24:10'],
            ['id' => 21, 'name' => 'GREE 1pk 09MOO', 'unit' => 'set', 'buy_price' => '3739000.0000', 'sell_price' => '3809000.0000', 'is_active' => 0, 'created_at' => '2025-01-10 08:16:58', 'updated_at' => '2025-07-04 11:24:31'],
            ['id' => 22, 'name' => 'GREE 1 1/2 pk 12MOO', 'unit' => 'set', 'buy_price' => '4809000.0000', 'sell_price' => '4959000.0000', 'is_active' => 0, 'created_at' => '2025-01-10 08:17:28', 'updated_at' => '2025-07-04 11:24:43'],
            ['id' => 23, 'name' => 'GREE 2pk 18MOO', 'unit' => 'set', 'buy_price' => '6469000.0000', 'sell_price' => '6629000.0000', 'is_active' => 0, 'created_at' => '2025-01-10 08:18:20', 'updated_at' => '2025-07-04 11:24:53'],
            ['id' => 24, 'name' => 'GREE 1/2pk Low Watt 05C3E', 'unit' => 'set', 'buy_price' => '3639000.0000', 'sell_price' => '3729000.0000', 'is_active' => 1, 'created_at' => '2025-01-10 08:20:53', 'updated_at' => '2025-01-10 08:20:53'],
            ['id' => 25, 'name' => 'GREE 1pk Low Watt 09C3E', 'unit' => 'set', 'buy_price' => '4109000.0000', 'sell_price' => '4209000.0000', 'is_active' => 1, 'created_at' => '2025-01-10 08:21:37', 'updated_at' => '2025-01-10 08:21:37'],
            ['id' => 26, 'name' => 'GREE 1/2 pk Inverter 05F5S', 'unit' => 'set', 'buy_price' => '4379000.0000', 'sell_price' => '4529000.0000', 'is_active' => 1, 'created_at' => '2025-01-10 08:22:48', 'updated_at' => '2025-01-10 08:22:59'],
            ['id' => 27, 'name' => 'GREE 1pk Inverter 09F5S', 'unit' => 'set', 'buy_price' => '4669000.0000', 'sell_price' => '4849000.0000', 'is_active' => 1, 'created_at' => '2025-01-10 08:23:42', 'updated_at' => '2025-01-10 08:23:42'],
            ['id' => 28, 'name' => 'Gree Inverter 1 1/2pk 12F5S', 'unit' => 'set', 'buy_price' => '5599000.0000', 'sell_price' => '5799000.0000', 'is_active' => 1, 'created_at' => '2025-01-10 08:25:22', 'updated_at' => '2025-10-10 06:34:25'],
            ['id' => 29, 'name' => 'GREE 2pk Inverter 18F5S', 'unit' => 'set', 'buy_price' => '7919000.0000', 'sell_price' => '8119000.0000', 'is_active' => 1, 'created_at' => '2025-01-10 08:26:57', 'updated_at' => '2025-01-10 08:26:57'],
            ['id' => 30, 'name' => 'GREE portable 1pk 09P1', 'unit' => 'unit', 'buy_price' => '4329000.0000', 'sell_price' => '5579000.0000', 'is_active' => 1, 'created_at' => '2025-01-10 08:27:56', 'updated_at' => '2025-01-10 08:27:56'],
            ['id' => 31, 'name' => 'Air Curtain 90cm GREE FM-1.25-9K', 'unit' => 'unit', 'buy_price' => '2719000.0000', 'sell_price' => '2919000.0000', 'is_active' => 1, 'created_at' => '2025-01-10 08:29:54', 'updated_at' => '2025-01-10 08:29:54'],
            ['id' => 32, 'name' => 'Air Curtain 120cm GREE FM-1.25-12k', 'unit' => 'unit', 'buy_price' => '3089000.0000', 'sell_price' => '3289000.0000', 'is_active' => 1, 'created_at' => '2025-01-10 08:31:22', 'updated_at' => '2025-01-10 08:31:22'],
            ['id' => 33, 'name' => 'Daikin 2pk SCE50AV', 'unit' => 'set', 'buy_price' => '13391040.0000', 'sell_price' => '13500000.0000', 'is_active' => 1, 'created_at' => '2025-01-10 08:36:05', 'updated_at' => '2025-01-10 08:36:05'],
            ['id' => 34, 'name' => 'Daikin 3pk SCE71AV', 'unit' => 'set', 'buy_price' => '17449200.0000', 'sell_price' => '17600000.0000', 'is_active' => 1, 'created_at' => '2025-01-10 08:36:32', 'updated_at' => '2025-01-10 08:36:32'],
            ['id' => 35, 'name' => 'Daikin 5pk SCE125AY', 'unit' => 'set', 'buy_price' => '28380480.0000', 'sell_price' => '28550000.0000', 'is_active' => 1, 'created_at' => '2025-01-10 08:37:18', 'updated_at' => '2025-01-10 08:37:18'],
            ['id' => 36, 'name' => 'Daikin 3pk SVC85AV', 'unit' => 'set', 'buy_price' => '16312560.0000', 'sell_price' => '16450000.0000', 'is_active' => 1, 'created_at' => '2025-01-10 08:39:26', 'updated_at' => '2025-01-10 08:39:26'],
            ['id' => 37, 'name' => 'Daikin 5pk SVC125AY', 'unit' => 'set', 'buy_price' => '24668640.0000', 'sell_price' => '24700000.0000', 'is_active' => 1, 'created_at' => '2025-01-10 08:40:36', 'updated_at' => '2025-01-10 08:40:36'],
            ['id' => 38, 'name' => 'Ac Floorstanding Gree 2pk 18STS', 'unit' => 'set', 'buy_price' => '10159000.0000', 'sell_price' => '10689000.0000', 'is_active' => 1, 'created_at' => '2025-01-10 08:44:04', 'updated_at' => '2025-08-22 07:09:05'],
            ['id' => 39, 'name' => 'Ac Floorstanding Gree 3pk 24STS', 'unit' => 'set', 'buy_price' => '12490000.0000', 'sell_price' => '13070000.0000', 'is_active' => 1, 'created_at' => '2025-01-10 08:44:29', 'updated_at' => '2025-08-22 07:08:42'],
            ['id' => 40, 'name' => 'Ac Floorstanding Gree 5pk 48STS', 'unit' => 'set', 'buy_price' => '21590000.0000', 'sell_price' => '22950000.0000', 'is_active' => 1, 'created_at' => '2025-01-10 08:45:55', 'updated_at' => '2025-08-22 07:09:47'],
            ['id' => 41, 'name' => 'GREE GUD50T', 'unit' => 'set', 'buy_price' => '10700000.0000', 'sell_price' => '11300000.0000', 'is_active' => 1, 'created_at' => '2025-01-10 08:46:50', 'updated_at' => '2025-01-10 08:46:50'],
            ['id' => 42, 'name' => 'Ac GREE Cassette 3pk GU71T', 'unit' => 'set', 'buy_price' => '13970000.0000', 'sell_price' => '14670000.0000', 'is_active' => 1, 'created_at' => '2025-01-10 08:48:18', 'updated_at' => '2025-08-13 03:59:20'],
            ['id' => 43, 'name' => 'GREE 5pk GU125T', 'unit' => 'set', 'buy_price' => '20720000.0000', 'sell_price' => '21920000.0000', 'is_active' => 1, 'created_at' => '2025-01-10 08:50:02', 'updated_at' => '2025-01-10 08:50:02'],
            ['id' => 44, 'name' => 'Ac Cassete Gree 5pk GU140T', 'unit' => 'set', 'buy_price' => '24990000.0000', 'sell_price' => '26670000.0000', 'is_active' => 1, 'created_at' => '2025-01-10 08:51:07', 'updated_at' => '2025-10-02 04:27:04'],
            ['id' => 45, 'name' => 'Changhong 1/2 pk 05NVB', 'unit' => 'set', 'buy_price' => '2245000.0000', 'sell_price' => '2350000.0000', 'is_active' => 1, 'created_at' => '2025-01-10 08:53:25', 'updated_at' => '2025-01-10 08:53:25'],
            ['id' => 46, 'name' => 'Changhong 1 pk 09NVB', 'unit' => 'set', 'buy_price' => '2580000.0000', 'sell_price' => '2700000.0000', 'is_active' => 1, 'created_at' => '2025-02-05 04:29:16', 'updated_at' => '2025-02-05 04:29:16'],
            ['id' => 47, 'name' => 'Changhong 1 1/2 pk 12NVB', 'unit' => 'set', 'buy_price' => '3700000.0000', 'sell_price' => '3850000.0000', 'is_active' => 1, 'created_at' => '2025-02-05 04:31:25', 'updated_at' => '2025-02-05 04:31:25'],
            ['id' => 48, 'name' => 'Changhong 2 pk 18NVB', 'unit' => 'set', 'buy_price' => '4900000.0000', 'sell_price' => '5000000.0000', 'is_active' => 1, 'created_at' => '2025-02-05 04:33:27', 'updated_at' => '2025-02-05 04:33:27'],
            ['id' => 49, 'name' => 'Sharp 1/2pk 5ZCY', 'unit' => 'set', 'buy_price' => '2600000.0000', 'sell_price' => '2700000.0000', 'is_active' => 1, 'created_at' => '2025-02-05 04:34:06', 'updated_at' => '2025-02-05 04:34:06'],
            ['id' => 50, 'name' => 'Sharp 1 pk 9ZCY', 'unit' => 'set', 'buy_price' => '2900000.0000', 'sell_price' => '3050000.0000', 'is_active' => 1, 'created_at' => '2025-02-05 04:34:33', 'updated_at' => '2025-02-05 04:34:33'],
            ['id' => 51, 'name' => 'Sharp 1 1/2pk 12ZCY', 'unit' => 'set', 'buy_price' => '4550000.0000', 'sell_price' => '4650000.0000', 'is_active' => 1, 'created_at' => '2025-02-05 04:34:53', 'updated_at' => '2025-02-05 04:34:53'],
            ['id' => 52, 'name' => 'Sharp 2pk 18ZCY', 'unit' => 'set', 'buy_price' => '6110000.0000', 'sell_price' => '6250000.0000', 'is_active' => 1, 'created_at' => '2025-02-05 04:35:18', 'updated_at' => '2025-02-05 04:35:18'],
            ['id' => 53, 'name' => 'SHARP 1/2 pk 5BEY', 'unit' => 'set', 'buy_price' => '2600000.0000', 'sell_price' => '2700000.0000', 'is_active' => 1, 'created_at' => '2025-03-07 09:50:56', 'updated_at' => '2025-03-07 09:50:56'],
            ['id' => 54, 'name' => 'Sharp 1pk 9BEY', 'unit' => 'set', 'buy_price' => '2875000.0000', 'sell_price' => '3050000.0000', 'is_active' => 1, 'created_at' => '2025-03-07 09:52:13', 'updated_at' => '2025-03-07 09:52:13'],
            ['id' => 55, 'name' => 'Aqua 1/2pk 05FQAL', 'unit' => 'set', 'buy_price' => '2400000.0000', 'sell_price' => '2500000.0000', 'is_active' => 1, 'created_at' => '2025-03-07 09:53:21', 'updated_at' => '2025-03-07 09:53:21'],
            ['id' => 56, 'name' => 'Aqua 1pk 09FQAL', 'unit' => 'set', 'buy_price' => '2725000.0000', 'sell_price' => '2800000.0000', 'is_active' => 1, 'created_at' => '2025-03-07 09:53:47', 'updated_at' => '2025-03-07 09:53:47'],
            ['id' => 57, 'name' => 'AQUA 1 1/2pk 12FQAL', 'unit' => 'set', 'buy_price' => '4025000.0000', 'sell_price' => '4150000.0000', 'is_active' => 1, 'created_at' => '2025-03-07 09:54:11', 'updated_at' => '2025-03-07 09:54:11'],
            ['id' => 58, 'name' => 'Aqua 2pk 18FQAL', 'unit' => 'set', 'buy_price' => '5250000.0000', 'sell_price' => '5450000.0000', 'is_active' => 1, 'created_at' => '2025-03-07 09:55:40', 'updated_at' => '2025-03-07 09:55:40'],
            ['id' => 59, 'name' => 'Bestlife 1/2pk 05QAR', 'unit' => 'set', 'buy_price' => '2150000.0000', 'sell_price' => '2250000.0000', 'is_active' => 1, 'created_at' => '2025-03-07 09:56:37', 'updated_at' => '2025-03-07 09:56:37'],
            ['id' => 60, 'name' => 'Bestlife 1pk 09QAR', 'unit' => 'set', 'buy_price' => '2550000.0000', 'sell_price' => '2650000.0000', 'is_active' => 1, 'created_at' => '2025-03-07 09:56:59', 'updated_at' => '2025-03-07 09:56:59'],
            ['id' => 61, 'name' => 'Bestlife 1 1/2pk 12QAR', 'unit' => 'set', 'buy_price' => '3600000.0000', 'sell_price' => '3750000.0000', 'is_active' => 1, 'created_at' => '2025-03-07 09:57:28', 'updated_at' => '2025-03-07 09:57:28'],
            ['id' => 62, 'name' => 'Bestlife 2pk 18QAR', 'unit' => 'set', 'buy_price' => '4615000.0000', 'sell_price' => '4750000.0000', 'is_active' => 1, 'created_at' => '2025-03-07 09:57:49', 'updated_at' => '2025-03-07 09:57:49'],
            ['id' => 63, 'name' => 'Bestlife Floorstanding 3pk 71FX', 'unit' => 'set', 'buy_price' => '9000000.0000', 'sell_price' => '9500000.0000', 'is_active' => 1, 'created_at' => '2025-03-07 09:58:15', 'updated_at' => '2025-03-07 09:58:15'],
            ['id' => 64, 'name' => 'Bestlife Floorstanding 5pk 120FX', 'unit' => 'set', 'buy_price' => '15000000.0000', 'sell_price' => '15500000.0000', 'is_active' => 1, 'created_at' => '2025-03-07 09:58:38', 'updated_at' => '2025-03-07 09:58:38'],
            ['id' => 66, 'name' => 'GREE Cassette 2pk GUD50T', 'unit' => 'pcs', 'buy_price' => '11020000.0000', 'sell_price' => '10690000.0000', 'is_active' => 1, 'created_at' => '2025-06-26 05:53:30', 'updated_at' => '2025-06-26 05:53:30'],
            ['id' => 67, 'name' => 'Ac Gree Floorstanding 3pk 24TS(S)', 'unit' => 'pcs', 'buy_price' => '13600000.0000', 'sell_price' => '13300000.0000', 'is_active' => 1, 'created_at' => '2025-06-28 09:56:46', 'updated_at' => '2025-08-19 06:11:18'],
            ['id' => 68, 'name' => 'Ac Gree Split 3/4pk 07N1a', 'unit' => 'pcs', 'buy_price' => '3679000.0000', 'sell_price' => '3650000.0000', 'is_active' => 1, 'created_at' => '2025-06-28 09:59:44', 'updated_at' => '2025-08-19 06:10:51'],
            ['id' => 69, 'name' => 'Ac Gree Split 1pk 09N1a', 'unit' => 'pcs', 'buy_price' => '3809000.0000', 'sell_price' => '3750000.0000', 'is_active' => 1, 'created_at' => '2025-06-28 10:00:02', 'updated_at' => '2025-08-19 06:10:36'],
            ['id' => 70, 'name' => 'Ac Gree Split 2pk 18N1a', 'unit' => 'pcs', 'buy_price' => '6599000.0000', 'sell_price' => '6500000.0000', 'is_active' => 1, 'created_at' => '2025-06-28 10:00:20', 'updated_at' => '2025-08-19 06:10:11'],
            ['id' => 71, 'name' => 'Ac Gree Split 1 1/2 pk 12N1a', 'unit' => 'pcs', 'buy_price' => '4.9000', 'sell_price' => '4850000.0000', 'is_active' => 1, 'created_at' => '2025-07-08 03:13:45', 'updated_at' => '2025-08-19 06:09:38'],
            ['id' => 72, 'name' => 'Midea 1pk Standart MSFC-09CRN2X', 'unit' => 'pcs', 'buy_price' => '2700000.0000', 'sell_price' => '0.0000', 'is_active' => 1, 'created_at' => '2025-07-08 09:07:11', 'updated_at' => '2025-07-08 09:07:11'],
            ['id' => 73, 'name' => 'Midea 1pk Standart MSAF-09CRN2X', 'unit' => 'pcs', 'buy_price' => '2750000.0000', 'sell_price' => '0.0000', 'is_active' => 1, 'created_at' => '2025-07-08 09:07:54', 'updated_at' => '2025-07-08 09:07:54'],
            ['id' => 74, 'name' => 'Midea 1.5pk Standart MSFC-12CRN1-32', 'unit' => 'pcs', 'buy_price' => '4150000.0000', 'sell_price' => '0.0000', 'is_active' => 1, 'created_at' => '2025-07-08 09:09:14', 'updated_at' => '2025-07-08 09:09:14'],
            ['id' => 75, 'name' => 'Midea 2pk Standart MSAF-18CRN2X', 'unit' => 'pcs', 'buy_price' => '5300000.0000', 'sell_price' => '0.0000', 'is_active' => 1, 'created_at' => '2025-07-08 09:09:58', 'updated_at' => '2025-07-08 09:09:58'],
            ['id' => 78, 'name' => 'Flife 1/2PK 05FMOO2', 'unit' => 'pcs', 'buy_price' => '0.0000', 'sell_price' => '0.0000', 'is_active' => 1, 'created_at' => '2025-07-19 03:20:50', 'updated_at' => '2025-07-19 03:22:23'],
            ['id' => 79, 'name' => 'Ac split 2.5pk GWC.24F5S', 'unit' => 'pcs', 'buy_price' => '0.0000', 'sell_price' => '0.0000', 'is_active' => 1, 'created_at' => '2025-07-23 08:52:40', 'updated_at' => '2025-07-23 08:52:40'],
            ['id' => 80, 'name' => 'Midea 1/2pk Standart MSAFE-05CRN2X', 'unit' => 'pcs', 'buy_price' => '0.0000', 'sell_price' => '0.0000', 'is_active' => 1, 'created_at' => '2025-08-08 03:13:55', 'updated_at' => '2025-09-01 07:46:46'],
            ['id' => 81, 'name' => 'Ac Portabel Midea 1PK MPHA-09CRN7', 'unit' => 'pcs', 'buy_price' => '0.0000', 'sell_price' => '0.0000', 'is_active' => 1, 'created_at' => '2025-08-15 07:08:17', 'updated_at' => '2025-08-15 07:08:17'],
            ['id' => 82, 'name' => 'Ac Split Duct Gree 2Pk GU50PS', 'unit' => 'pcs', 'buy_price' => '0.0000', 'sell_price' => '0.0000', 'is_active' => 1, 'created_at' => '2025-09-09 06:27:06', 'updated_at' => '2025-09-09 06:27:06'],
            ['id' => 83, 'name' => 'Ac Split Gree 3/4pk Lowwat 07C3E', 'unit' => 'pcs', 'buy_price' => '0.0000', 'sell_price' => '0.0000', 'is_active' => 1, 'created_at' => '2025-09-16 06:52:25', 'updated_at' => '2025-09-16 06:52:25'],
            ['id' => 84, 'name' => 'Ac Split 1/2Pk Midea MSFCE-05CRN2X', 'unit' => 'pcs', 'buy_price' => '0.0000', 'sell_price' => '0.0000', 'is_active' => 1, 'created_at' => '2025-09-17 04:12:10', 'updated_at' => '2025-09-17 04:14:00'],
            ['id' => 85, 'name' => 'Circool25 Air Cooler', 'unit' => 'pcs', 'buy_price' => '0.0000', 'sell_price' => '0.0000', 'is_active' => 1, 'created_at' => '2025-10-10 06:33:37', 'updated_at' => '2025-10-10 06:33:37'],
            ['id' => 86, 'name' => 'Midea Circulation Table Fan MFG150MOAPB', 'unit' => 'pcs', 'buy_price' => '0.0000', 'sell_price' => '0.0000', 'is_active' => 1, 'created_at' => '2025-10-13 04:48:15', 'updated_at' => '2025-10-13 04:48:15'],
            ['id' => 87, 'name' => 'Ac Split Gree 1/2Pk GWC-05N1A', 'unit' => 'pcs', 'buy_price' => '0.0000', 'sell_price' => '0.0000', 'is_active' => 1, 'created_at' => '2025-10-23 05:01:42', 'updated_at' => '2025-10-23 05:01:42'],
        ];

        $this->command->info('Importing ' . count($oldItems) . ' items from old system...');

        DB::beginTransaction();

        try {
            foreach ($oldItems as $index => $oldItem) {
                // Generate item code from name (first 3 letters + ID)
                $namePrefix = strtoupper(substr(preg_replace('/[^A-Za-z0-9]/', '', $oldItem['name']), 0, 3));
                $code = $namePrefix . str_pad($oldItem['id'], 4, '0', STR_PAD_LEFT);

                // Extract brand from name (common AC brands)
                $brand = null;
                $brands = ['Daikin', 'GREE', 'Changhong', 'Sharp', 'Aqua', 'Bestlife', 'Midea', 'Flife'];
                foreach ($brands as $b) {
                    if (stripos($oldItem['name'], $b) !== false) {
                        $brand = $b;
                        break;
                    }
                }

                Item::create([
                    'code' => $code,
                    'name' => $oldItem['name'],
                    'description' => null,
                    'unit' => $oldItem['unit'],
                    'cost' => round((float) $oldItem['buy_price'], 2),
                    'price' => round((float) $oldItem['sell_price'], 2),
                    'min_stock' => 0,
                    'max_stock' => null,
                    'category' => null,
                    'brand' => $brand,
                    'version' => 0,
                    'is_active' => (bool) $oldItem['is_active'],
                    'created_at' => $oldItem['created_at'],
                    'updated_at' => $oldItem['updated_at'],
                ]);

                if (($index + 1) % 10 === 0) {
                    $this->command->info('Imported ' . ($index + 1) . ' items...');
                }
            }

            DB::commit();

            $this->command->info('Successfully imported ' . count($oldItems) . ' items!');
        } catch (\Exception $e) {
            DB::rollBack();
            $this->command->error('Error importing items: ' . $e->getMessage());
            throw $e;
        }
    }
}
