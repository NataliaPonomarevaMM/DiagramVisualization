export interface Iris {
    sepalLength: number;
    sepalWidth: number;
    petalLength: number;
    petalWidth: number;
    species: string;
}

export interface IrisTree {
    data: Iris;
    children: IrisTree[];
}