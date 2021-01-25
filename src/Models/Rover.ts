import {Position} from './Coordinate'
import {Orientation} from './Orientation'

class Rover
{
    instructions: Orientation[];
    current_pos: Position;
    end_pos?: Position;
}

export default Rover;