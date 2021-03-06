extern crate wasm_bindgen;

use wasm_bindgen::prelude::*;


#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Cell {
  Dead = 0,
  Alive = 1
}

#[wasm_bindgen]
pub struct Universe {
  width: u32,
  height: u32,
  cells: Vec<Cell>,
}

impl Universe {
  fn get_index(&self, row: u32, column: u32) -> usize {
    (row * self.width + column) as usize
  }

  fn live_neighbor_count(&self, row: u32, column: u32) -> u8 {
    let mut count = 0;

    let north = if row == 0 {
        self.height - 1
    } else {
        row - 1
    };

    let south = if row == self.height - 1 {
        0
    } else {
        row + 1
    };

    let west = if column == 0 {
        self.width - 1
    } else {
        column - 1
    };

    let east = if column == self.width - 1 {
        0
    } else {
        column + 1
    };

    let nw = self.get_index(north, west);
    count += self.cells[nw] as u8;

    let n = self.get_index(north, column);
    count += self.cells[n] as u8;

    let ne = self.get_index(north, east);
    count += self.cells[ne] as u8;

    let w = self.get_index(row, west);
    count += self.cells[w] as u8;

    let e = self.get_index(row, east);
    count += self.cells[e] as u8;

    let sw = self.get_index(south, west);
    count += self.cells[sw] as u8;

    let s = self.get_index(south, column);
    count += self.cells[s] as u8;

    let se = self.get_index(south, east);
    count += self.cells[se] as u8;

    count
  }

  fn _toggle_cell(&mut self, index: usize) {
    self.cells[index] = match self.cells[index] {
      Cell::Dead => Cell::Alive,
      Cell::Alive => Cell::Dead 
    };
  }
}

#[wasm_bindgen]
impl Universe {
  pub fn tick(&mut self) {
    let mut next_generation_cells = self.cells.clone();


    // Iterate over cells to generate the next generation
    for row in 0..self.height {
      for col in 0..self.width {
        let index = self.get_index(row, col);
        let cell = self.cells[index];

        let live_neighbors = self.live_neighbor_count(row, col);

        // Get this cell's state in the next generation
        let next_generation_cell = match (cell, live_neighbors) {
          (Cell::Alive, x) if x < 2 => Cell::Dead,
          (Cell::Alive, 2) | (Cell::Alive, 3) => Cell::Alive,
          (Cell::Alive, x) if x > 3 => Cell::Dead,
          (Cell::Dead, 3) => Cell::Alive,
          (otherwise, _) => otherwise
        };


        next_generation_cells[index] = next_generation_cell;
      }
    }

    self.cells = next_generation_cells;
  }

  pub fn new(width: u32, height: u32) -> Universe {
    let cells = (0..width * height)
      .map(|i| {
        if i % 2 == 0 || i % 7 == 0 {
          Cell::Alive
        } else {
          Cell::Dead
        }
      })
      .collect();

      Universe {
        width,
        height,
        cells,
      }
  }

  pub fn empty(width: u32, height: u32) -> Universe {
    let cells = (0..width * height).map(|_i| {
      Cell::Dead
    }).collect();

    Universe {
      width,
      height,
      cells
    }
  }

  pub fn toggle_cell(&mut self, row: u32, column: u32) {
    let index = self.get_index(row, column);
    self._toggle_cell(index);
  }

  pub fn add_glider(&mut self, row: u32, column: u32) {
    let corner = self.get_index(row, column);
    let cell_indices = [corner, self.get_index(row + 1, column + 1), self.get_index(row + 1, column + 2), self.get_index(row + 2, column), self.get_index(row + 2, column + 1)];
    for index in cell_indices.iter() {
      self.cells[*index] = Cell::Alive;
    }
  }

  pub fn width(&self) -> u32 {
    self.width
  }

  pub fn height(&self) -> u32 {
    self.height
  }

  pub fn cells(&self) -> *const Cell {
    self.cells.as_ptr()
  }
}