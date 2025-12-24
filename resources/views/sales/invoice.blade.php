<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $sale->invoice_no }} - {{ config('app.name') }}</title>
    <style>
        * {
            background-image: none !important;
        }

        body {
            font-family: Tahoma, Arial, Verdana, sans-serif;
            font-size: 100%;
            margin: 0;
            color: #000;
            background-color: #fff;
        }

        @media print {
            @page {
                size: 8.5in 11in portrait;
                margin: 0.5in;
            }

            body * {
                visibility: hidden;
            }

            .printme, .printme * {
                visibility: visible;
            }

            .printme {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
            }

            .printme * {
                color: #000;
            }

            header, footer, aside, nav, form, iframe, .menu, .hero, .adslot {
                display: none !important;
            }
        }

        .printme {
            position: relative;
            overflow: hidden;
            min-height: 100vh;
        }

        img, svg {
            display: none !important;
        }

        img.print, svg.print {
            display: block;
            max-width: 100%;
        }

        table, img, svg {
            break-inside: avoid;
        }

        #title {
            margin-bottom: 8pt;
            padding-left: 4px;
            width: 100%;
        }

        #title .spacer {
            margin-left: 25px;
        }

        #title h2 {
            font-size: 8pt;
            line-height: 12pt;
            letter-spacing: 1pt;
            font-weight: 400;
            margin: 0;
        }

        #title p {
            font-size: 8pt;
            line-height: 12pt;
            letter-spacing: 1pt;
            margin: 0;
        }

        .table {
            border-collapse: collapse;
        }

        .table tbody td {
            padding: 2px 4px;
        }

        #infoContent {
            display: flex;
            gap: 8pt;
        }

        #infoContent .table {
            width: 100%;
            margin-left: auto;
            text-align: right;
        }

        #infoContent .table p,
        #infoContent .table h3 {
            margin: 0;
        }

        #infoContent .table p {
            font-size: 8pt;
            line-height: 12pt;
            letter-spacing: 1pt;
        }

        #infoContent .table h3 {
            font-size: 8pt;
            line-height: 15pt;
            letter-spacing: 1pt;
            font-weight: 400;
        }

        #mainTable {
            margin-top: 8pt;
            width: 100%;
            border-collapse: collapse;
        }

        #mainTable th,
        #mainTable td {
            padding: 2px 4px;
            font-size: 8pt;
            line-height: 12pt;
            letter-spacing: 1pt;
        }

        #mainTable th {
            border-bottom: 2px solid #000;
            text-align: left;
        }

        #mainTable td {
            border-bottom: thin solid #000;
        }

        #bottomSection {
            margin-top: 8pt;
        }

        #bottomSection p {
            margin: 0;
            font-weight: bold;
            font-size: 8pt;
            line-height: 12pt;
            letter-spacing: 1pt;
            margin-bottom: 2pt;
        }

        #sigSection {
            font-size: 8pt;
            line-height: 12pt;
            letter-spacing: 1pt;
            display: flex;
            flex-wrap: wrap;
            width: 100%;
            margin-top: 40pt;
        }

        #sigSection div {
            flex: 1;
        }

        #sigSection p {
            font-weight: bold;
            text-align: center;
            margin: 0;
        }

        #mainTable tr.page-break td {
            padding: 0;
            border: none;
        }
    </style>
</head>
<body>
    <main class="printme">
        <section id="mainContent">
            <div id="infoContent">
                <div id="title">
                    <h2>Acindo Buana Citra</h2>
                    <p>Jl. Prof. HM. Yamin SH No. 70A Medan<br>Tel: (061) 4579354<br><span class="spacer"></span>(061) 4553292<br>HP: 0811600692<br><span class="spacer"></span>0811659759</p>
                </div>

                <table cellpadding="0" cellspacing="0" class="table">
                    <tbody>
                        <tr>
                            <td>
                                <p>Kepada:</p>
                                <h3>{{ $sale->customer->name }}</h3>
                                <p>{{ $sale->customer->address ?? '-' }}</p>
                                <p>{{ $sale->customer->phone ?? '-' }}</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>Nomor Invoice: <br>{{ $sale->invoice_no }}</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>Tanggal: <br>{{ $sale->sale_date->format('d/M/Y') }}</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <table cellpadding="0" cellspacing="0" id="mainTable">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Jumlah</th>
                        <th>Harga Satuan</th>
                        <th>Sub-Total</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($sale->items as $index => $item)
                        <tr>
                            <td>{{ $item->item->name }}</td>
                            <td>{{ number_format($item->qty_ordered, 0) }}</td>
                            <td>{{ number_format($item->price, 0) }}</td>
                            <td>{{ number_format($item->subtotal, 0) }}</td>
                        </tr>
                        @if ($index >= 6 && $index % 15 === 0)
                            <tr class="page-break">
                                <td colspan="4"></td>
                            </tr>
                        @endif
                    @endforeach
                </tbody>

                <tfoot>
                    <tr class="item">
                        <td colspan="3" align="right" style="font-weight: bold">Total</td>
                        <td style="font-weight: bold">{{ number_format($sale->total, 0) }}</td>
                    </tr>
                </tfoot>
            </table>

            <div id="bottomSection">
                @php
                    use NumberToWords\NumberToWords;
                    $numberToWords = new NumberToWords();
                    $numberTransformer = $numberToWords->getNumberTransformer('id');
                @endphp
                <p>Terbilang: {{ ucwords($numberTransformer->toWords($sale->total)) }} Rupiah</p>
                <p>Credit Term:</p>
                <p>Jatuh Tempo:</p>
            </div>
        </section>

        <section id="sigSection">
            <div>
                <p>Hormat Kami,</p>
            </div>
            <div>
                <p>Yang Mengetahui,</p>
            </div>
            <div>
                <p>Yang Menerima,</p>
            </div>
        </section>

        <script type="text/javascript">
            window.onload = function() {
                window.print();
            };
        </script>
    </main>
</body>
</html>
