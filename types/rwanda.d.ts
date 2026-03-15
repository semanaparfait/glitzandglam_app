declare module "rwanda" {
  export function Provinces(): string[];
  export function Districts(params: { provinces: string }): string[];
  export function Sectors(params: {
    province: string;
    district: string;
  }): string[];
  export function Cells(params: {
    province: string;
    district: string;
    sector: string;
  }): string[];
  export function Villages(params: {
    province: string;
    district: string;
    sector: string;
    cell: string;
  }): string[];
}
