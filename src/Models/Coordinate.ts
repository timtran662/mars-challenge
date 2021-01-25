import { Cardinal } from "./Cardinal"

class Coordinate
{
    points : number[]
}

class Position extends Coordinate
{
    direction: Cardinal
}

export{
    Coordinate,
    Position
}
