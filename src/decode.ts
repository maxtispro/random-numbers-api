import { hashFile512 } from "./hash";

const nextRandom = () => hashFile512("./include/images/food.png");

class RandomTable {
    private table = nextRandom();
    next(n: number) {
        return this.table.then(r => {
            if (n < r.length) {
                
            }
        })
    }
}

export function random() {

}