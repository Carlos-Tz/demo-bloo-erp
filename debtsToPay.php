<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Content-Range, Content-Disposition, Content-Description');

//require 'phpspreadsheet/vendor/autoload.php';
require 'vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

$postdata = file_get_contents("php://input");
if(isset($postdata) && !empty($postdata)){
// Extract the data.
    $request = json_decode($postdata);
    
}

$spreadsheet = new Spreadsheet();
$estado = 2 ;
    while ($estado <= 4) {
        $fila = 1 ;
        switch ($estado) {
            case 2:
	            $sheet = $spreadsheet->getActiveSheet();
	            $titulo = "Programado" ;
	            $sheet->setTitle($titulo);
	            break;
            case 3:
                $sheet = $spreadsheet->createSheet();
                $titulo = "Parcial" ;
                $sheet->setTitle($titulo);
                break;
            case 4:
                $sheet = $spreadsheet->createSheet();
                $titulo = "Pagado" ;
	            $sheet->setTitle($titulo);
	            break;
	        
        }
        $sheet->setCellValue('A'.$fila, "ORDEN DE COMPRA") ;
	    $sheet->setCellValue('B'.$fila, "FECHA PROGRAMADA") ;
	    $sheet->setCellValue('C'.$fila, "RFC") ;
	    $sheet->setCellValue('D'.$fila, "PROVEEDOR") ;
	    $sheet->setCellValue('E'.$fila, "SUBTOTAL") ;
	    $sheet->setCellValue('F'.$fila, "IVA") ;
	    $sheet->setCellValue('G'.$fila, "TOTAL") ;
	    $sheet->setCellValue('H'.$fila, "SALDO") ;
	    $sheet->getStyle('A1:H1')->getFont()->setBold(true)->setSize(12);
        $sheet->getStyle('A1:H1')->getAlignment()->setHorizontal('center');
        $sheet->getStyle('A1:H1')->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('155A89');
        $sheet->getStyle('A1:H1')->getFont()->getColor()->setRGB('FFFFFF');
        $sheet->getStyle('E:H')->getNumberFormat()->setFormatCode(\PhpOffice\PhpSpreadsheet\Style\NumberFormat::FORMAT_CURRENCY_USD_SIMPLE);

        $sheet->freezePane("A2") ;
	    $fila++ ;
	    $vuelta = true ;
        foreach($request->orders as $row){
	    /* while($row = mysqli_fetch_array($orden)){*/
	        if($row->status == $estado) {
	            if(!$vuelta) {
	                $sheet->getStyle('A'.$fila.':H'.$fila)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('8ac8f0');
	            }
        	    //$sheet->setCellValue('A'.$fila, $row["status"]);
        	    $sheet->setCellValue('A'.$fila, "OC-".$row->id);
        	    $sheet->setCellValue('B'.$fila, $row->paymentdate);
        	    $sheet->setCellValue('C'.$fila, $row->provider);
        	    $sheet->setCellValue('D'.$fila, $row->provider_name);
        	    $sheet->setCellValue('E'.$fila, strval($row->price*$row->quantity));
        	    $sheet->setCellValue('F'.$fila, strval($row->price*$row->quantity*$row->iva));
        	    $sheet->setCellValue('G'.$fila, strval(($row->price*$row->quantity)+($row->price*$row->quantity*$row->iva)));
        	    $sheet->setCellValue('H'.$fila, strval($row->balance));
        	    $sub_encabezado = true ;
                foreach($row->payments as $pay){
                    if ($sub_encabezado){
                        $color = new \PhpOffice\PhpSpreadsheet\Style\Color('000000');
                        $sheet->getStyle('A'.$fila.':H'.$fila)->getBorders()->getTop()->setColor($color);
                        $sheet->getStyle('A'.$fila.':H'.$fila)->getBorders()->getTop()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THICK);
                        $fila++ ;
                        $sheet->setCellValue('B'.$fila, "FECHA DE PAGO") ;
                        $sheet->setCellValue('C'.$fila, "FOLIO") ;
                        $sheet->setCellValue('D'.$fila, "METODO DE PAGO") ;
                        $sheet->setCellValue('E'.$fila, "MONTO") ;
                        $sheet->setCellValue('F'.$fila, "DOCUMENTO") ;
                        $sheet->getStyle('B'.$fila.':F'.$fila)->getFont()->setBold(true)->setSize(11);
                        $sheet->getStyle('B'.$fila.':F'.$fila)->getAlignment()->setHorizontal('center');
                        $sheet->getStyle('B'.$fila.':F'.$fila)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('3da6e1');
                        $sheet->getStyle('B'.$fila.':F'.$fila)->getFont()->getColor()->setRGB('FFFFFF');
                    }
                    $fila ++ ;
                    $sheet->setCellValue('B'.$fila, $pay->date);
                    if($pay->folio) $sheet->setCellValue('C'.$fila, $pay->folio);
                    $sheet->setCellValue('D'.$fila, $pay->paymenttype);
                    $sheet->setCellValue('E'.$fila, $pay->amount);
                    if($pay->document) $sheet->setCellValue('F'.$fila, $pay->document);
                    $sub_encabezado = false ;
                }
                if(!$sub_encabezado) {
                    $color = new \PhpOffice\PhpSpreadsheet\Style\Color('000000');
                    $sheet->getStyle('A'.$fila.':H'.$fila)->getBorders()->getBottom()->setColor($color);
                    $sheet->getStyle('A'.$fila.':H'.$fila)->getBorders()->getBottom()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THICK);
                    $sub_encabezado = true ;
                }
                //mysqli_data_seek($detalle, 0);
                $fila++ ;
                $vuelta = !$vuelta ;
	        }
	    }
	    $sheet->getColumnDimension("A")->setAutoSize(true);
	    $sheet->getColumnDimension("B")->setAutoSize(true);
	    $sheet->getColumnDimension("C")->setAutoSize(true);
	    $sheet->getColumnDimension("D")->setAutoSize(true);
	    $sheet->getColumnDimension("E")->setAutoSize(true);
	    $sheet->getColumnDimension("F")->setAutoSize(true);
	    $sheet->getColumnDimension("G")->setAutoSize(true);
	    $sheet->getColumnDimension("H")->setAutoSize(true);
	    $estado++ ;
    }

$writer = new Xlsx($spreadsheet);
$writer->save('cuentasXpagar.xlsx');

?>