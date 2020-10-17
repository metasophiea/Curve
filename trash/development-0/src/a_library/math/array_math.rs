pub fn array_difference<T:PartialEq + Copy>(a_array:&Vec<T>, b_array:&Vec<T>) -> (Vec<T>, Vec<T>) {
    let mut a_output:Vec<T> = vec![];
    let mut b_output:Vec<T> = vec![];

    for a_item in a_array {
        match b_array.iter().position(|b_item| b_item == a_item) {
            None => {  a_output.push(*a_item)  },
            Some(_) => {},
        }
    }

    for b_item in b_array {
        match a_array.iter().position(|a_item| a_item == b_item) {
            None => {  b_output.push(*b_item)  },
            Some(_) => {},
        }
    }

    (a_output, b_output)
}

pub fn array_intersect<T:PartialEq + Copy>(a:&Vec<T>, b:&Vec<T>) -> Vec<T> {
    let mut output:Vec<T> = vec![];

    for a_item in a {
        match b.iter().position(|b_item| b_item == a_item) {
            None => {},
            Some(_) => { output.push(*a_item) },
        }
    }

    output
}