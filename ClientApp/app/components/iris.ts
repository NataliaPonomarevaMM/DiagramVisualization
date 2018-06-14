export interface IIris {
    sepalLength: number;
    sepalWidth: number;
    petalLength: number;
    petalWidth: number;
    species: string;
}

export interface IHierarchy {
    data: number[];
    children: IHierarchy[];
}
