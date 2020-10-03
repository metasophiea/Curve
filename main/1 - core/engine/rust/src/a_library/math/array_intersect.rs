pub fn array_intersect<T: PartialEq + Copy>(a:&Vec<T>, b:&Vec<T>) -> Vec<T> {
    let mut output:Vec<T> = vec![];

    for a_item in a {
        match b.iter().position(|b_item| b_item == a_item) {
            None => {},
            Some(_) => { output.push(*a_item) },
        }
    }

    output
}