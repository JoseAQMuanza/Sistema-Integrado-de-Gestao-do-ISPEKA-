// types/jspdf.d.ts
import 'jspdf';
import 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable?: {
      finalY: number;
    };
    autoTable: (options: AutoTableOptions) => jsPDF;
  }

  interface AutoTableOptions {
    startY?: number;
    margin?: { top?: number; right?: number; bottom?: number; left?: number };
    head?: (string | number)[][];
    body?: (string | number)[][];
    foot?: (string | number)[][];
    theme?: 'striped' | 'grid' | 'plain';
    headStyles?: {
      fillColor?: number[];
      textColor?: number;
      fontStyle?: 'normal' | 'bold' | 'italic';
      halign?: 'left' | 'center' | 'right';
      valign?: 'top' | 'middle' | 'bottom';
    };
    styles?: {
      fontSize?: number;
      cellPadding?: number;
      lineColor?: number[];
      lineWidth?: number;
      font?: string;
      textColor?: number[];
      fillColor?: number[];
      halign?: 'left' | 'center' | 'right';
      valign?: 'top' | 'middle' | 'bottom';
    };
    columnStyles?: {
      [key: string]: {
        cellWidth?: number | 'auto' | 'wrap';
        minCellWidth?: number;
        minCellHeight?: number;
      };
    };
    didDrawPage?: (data: {
      cursor: { x: number; y: number };
      pageNumber: number;
      pageCount: number;
      settings: any;
    }) => void;
  }
}