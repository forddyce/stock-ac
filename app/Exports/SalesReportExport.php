<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class SalesReportExport implements FromCollection, WithHeadings, WithMapping, WithStyles
{
    protected $sales;

    public function __construct($sales)
    {
        $this->sales = $sales;
    }

    public function collection()
    {
        return $this->sales;
    }

    public function headings(): array
    {
        return [
            'Tanggal',
            'Nomor Invoice',
            'Customer',
            'Sales',
            'Item',
            'Kuantitas',
            'Harga Satuan',
            'Subtotal',
            'Total',
        ];
    }

    public function map($sale): array
    {
        $rows = [];
        
        foreach ($sale->items as $index => $item) {
            $rows[] = [
                $index === 0 ? $sale->sale_date->format('d/m/Y H:i') : '',
                $index === 0 ? $sale->invoice_no : '',
                $index === 0 ? $sale->customer->name : '',
                $index === 0 ? ($sale->salesPerson ? $sale->salesPerson->name : '-') : '',
                $item->item->name,
                number_format($item->qty_ordered, 0),
                number_format($item->price, 0),
                number_format($item->subtotal, 0),
                $index === 0 ? number_format($sale->total, 0) : '',
            ];
        }
        
        return $rows;
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
