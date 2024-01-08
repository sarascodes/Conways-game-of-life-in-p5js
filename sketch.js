// DIMENSIONS
let grid_columns = 100;
let grid_rows = 100;
let cell_size = 5;
let playing = false;
let time_delay = 100;

// COLORS
const BACKGROUND_COLOR = [13, 30, 71, 255]; 
const YELLOW_COLOR = [255,255,0,255]; //[255,220,90,255]; 
const GRID_COLOR = [255, 255, 0, 255];
const GRAY_COLOR = [179,182,183,255];

// DATA
let grid = [];

function draw_grid() {
  push();
  stroke(YELLOW_COLOR);
  strokeWeight(0.1);

  for (let x = 0; x < grid_columns; x++) {
    for (let y = 0; y < grid_rows; y++) {

      if (grid[x][y] == true) {
        fill(YELLOW_COLOR);
      } else noFill();

      rect(x * cell_size, y * cell_size, cell_size, cell_size);
    }
  }

  pop();
}

function adjust_coordinate(coordinate, lower, upper) {
  let result = coordinate;
  if (coordinate < lower) result = upper + coordinate;
  if (coordinate > upper) result = lower + (coordinate - upper);
  return result;
}

function calculate() {
  let output = [];
  for (let x = 0; x < grid_columns; x++) {

    output[x] = [];
    for (let y = 0; y < grid_rows; y++) {

      let alive_neighbors = 0;

      for (let ix = -1; ix < 2; ix++) {
        for (let iy = -1; iy < 2; iy++) {
          let tx = adjust_coordinate(x + ix, 0, grid_columns - 1);
          let ty = adjust_coordinate(y + iy, 0, grid_rows - 1);
          if (grid[tx][ty] == true) {
            alive_neighbors++;
          }
        }
      }
      if (grid[x][y] == true) {
        output[x][y] = true;
        alive_neighbors--;
        if (alive_neighbors < 2) output[x][y] = false;
        if (alive_neighbors > 3) output[x][y] = false;
      } else {
        output[x][y] = false;
        if (alive_neighbors == 3) output[x][y] = true;
      }
    }
  }
  grid = output;
}

let last;

function setup() {
  createCanvas(grid_columns * cell_size, grid_rows * cell_size+30);
}


function draw() {
  background(BACKGROUND_COLOR);

  if (!playing) {
    push();
    noStroke();
    fill(YELLOW_COLOR);
    textSize(40);
    let message = "Conway's game of life"
    text(message, width / 2 - textWidth(message) / 2, height / 2);
    textSize(20);
    fill(GRAY_COLOR);

    message = "Press SPACE to start (need keyboard)"
    text(message, width / 2 - textWidth(message) / 2, height / 2+40);
    pop();
  } else {
    if (millis() > last + time_delay) {
      calculate();
      last = millis();
    }
    draw_grid();
    fill(GRAY_COLOR);
    noStroke();
    textSize(15);
    text("Press ESC to end", 5, height-10);
  }
}

function keyPressed()
{
  if ((keyCode==32) && !playing)
  {
    playing=true;
    for (let x = 0; x < grid_columns; x++) {
      grid[x] = [];
      for (let y = 0; y < grid_rows; y++) {
        if (random(0, 100) > 50) grid[x][y] = true; else grid[x][y] = false;
      }
    }
    last = millis();
  }

  if ((keyCode==ESCAPE) && playing)
  {
    playing=false;
  }


}
