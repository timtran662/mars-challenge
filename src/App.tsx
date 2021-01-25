import React from 'react';
import './App.css';
import Plateau from './Models/Plateau'
import Rover from './Models/Rover';
import { Cardinal } from './Models/Cardinal';
import { Orientation } from './Models/Orientation';
import {Position } from './Models/Coordinate';

interface Props
{
}

interface State
{
  Plane : Plateau, 
  Rovers : Rover[]
  FinalCoordinates : Position[]
}


class App extends React.Component<Props, State> {
  constructor(props: Props){
    super(props);
    this.state = {
      Plane : {
        origin: {
          points: [0,0]
        },
        topRight : {
          points : [0,0]
        }
      },
      Rovers : [],
      FinalCoordinates: []
    }
  }

  TurnLeft = (current: Position) => {
        if(current.direction.match("N"))
        {
          return Cardinal.W
        }
        else if(current.direction.match("S"))
        {
          return Cardinal.E
        }
        else if(current.direction.match("E"))
        {
          return Cardinal.N
        }
        else if(current.direction.match("W"))
        {
          return Cardinal.S
        }
        else
        {
          return Cardinal.S
        }
  }

  TurnRight = (current: Position) => {
    if(current.direction.match("N"))
    {
      return Cardinal.E
    }
    else if(current.direction.match("S"))
    {
      return Cardinal.W
    }
    else if(current.direction.match("E"))
    {
      return Cardinal.S
    }
    else if(current.direction.match("W"))
    {
      return Cardinal.N
    }
    else
    {
      return Cardinal.N
    }
  }

  Move = (current: Position) => {
    if(current.direction.match("N"))
    {
      return [current.points[0], current.points[1] + 1]
    }
    else if(current.direction.match("S"))
    {
      return [current.points[0], current.points[1] - 1]
    }
    else if(current.direction.match("E"))
    {
      return [current.points[0] + 1, current.points[1]]
    }
    else if(current.direction.match("W"))
    {
      return [current.points[0] - 1, current.points[1]]
    }
    else
    {
      return [0,0]
    }
  }

  CalculatePath = (current : Position, instructions: Orientation[]) => 
  {    
    var c = current.points;
    var d = current.direction;

    var end_pos : Position = {
      direction : d,
      points : c
    }

    instructions.map(instruction => {
      switch(instruction){
        case Orientation.L:
          end_pos = {
            direction : this.TurnLeft(end_pos),
            points : end_pos.points
          }
          break;
        case Orientation.R:
          end_pos = {
            direction : this.TurnRight(end_pos),
            points : end_pos.points
          }
          break;
        case Orientation.M:
          end_pos = {
            points : this.Move(end_pos),
            direction: end_pos.direction
          }
          break;
      }
    })

    return end_pos
  }

  ReadFile = () => {
    fetch('input.txt')
    .then((r) => r.text())
    .then(text => {
      var arr = text.split("\n");
      var area = arr[0];
      var coord = area.split(" ");

      this.setState({Plane: {origin: {points: [0,0]}, topRight: {points: [parseInt(coord[0]), parseInt(coord[1])]}}})

      var arr2 = arr.slice(1)
     
      const rover_inputs : string[][] = arr2.reduce(function (rows, key, index){
        return (index % 2 == 0 ? rows.push([key]) : rows[rows.length - 1].push(key)) && rows
      }, []);

      var rovers = []

      rover_inputs.map(input => {
        var position = input[0].split(" ");
        var instructions = input[1]

        var rover : Rover = {
          current_pos : {
            points : [parseInt(position[0]), parseInt(position[1])],
            direction : position[2] as Cardinal
          },
          instructions: instructions.split('').map(ori => 
            ori as Orientation
          )
        
        }
        rovers.push(rover)

        this.setState({Rovers: rovers})
      })
    })
  }

  CalculateEndpoints = () => {

    var positions = []
    this.state.Rovers.map(rover => {
      positions.push(this.CalculatePath(rover.current_pos, rover.instructions))
    })

    this.setState({FinalCoordinates: positions})
  }

  render(){
    return (
    <div>
      <h1>Please import the text file containing the rover's coordinates: </h1>
      <input type="file" onChange={this.ReadFile}></input>

      <h2>This is the top right boundary: {this.state.Plane.topRight.points[0]}, {this.state.Plane.topRight.points[1]} </h2>

      <h2>These are the inputs read: </h2>
      {this.state.Rovers.map(input => {
        return(<h3>{input.current_pos.points[0]} {input.current_pos.points[1]} {input.current_pos.direction}</h3>)
      })}

      <button onClick={this.CalculateEndpoints}>Run Their Instructions</button>
      {this.state.FinalCoordinates.length != 0? <h2>Here are the output positions of the Rover's respectively</h2> : <h3></h3>}
      {this.state.FinalCoordinates.map(output => {
         var x_limit = this.state.Plane.topRight.points[0];
         var y_limit = this.state.Plane.topRight.points[1];
         return output.points[0] > x_limit || output.points[1] > y_limit || output.points[0] < this.state.Plane.origin.points[0] || output.points[1] < this.state.Plane.origin.points[1] ? 
         (<h3 style={{color:"red"}}>{output.points[0]} {output.points[1]} {output.direction} Instructions moved this rover out of the area of plateau.</h3>) 
         : (<h3 style={{color:"green"}}>{output.points[0]} {output.points[1]} {output.direction}</h3>)
      })
      }

    </div>
    )
  }
}

export default App;
