export interface IIris {
    sepalLength: number;
    sepalWidth: number;
    petalLength: number;
    petalWidth: number;
    species: string;
    id: string;
}

export interface IHierarchy {
    data: IIris[];
    id: string;
    species: string;
    children: IHierarchy[];
}
