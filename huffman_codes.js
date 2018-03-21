//Anthony Rusignuolo, Michael Macari, Jon Lafleur
//Huffman Codes

var prompt = require('prompt-sync')();
var fs = require('fs');


class priorityQueue{
    constructor(){
        this.queue = [];
    };

    enqueue(node){
        //binary search guy
        if (this.queue.length === 0 || this.queue[this.queue.length - 1].frequency <= node.frequency)
            this.queue.push(node);
        else if (node.frequency <= this.queue[0].frequency)
            this.queue.unshift(node);
        else {
            var i = Math.floor((this.queue.length) / 2);
            while (true){
                if (node.frequency >= this.queue[i].frequency && node.frequency <= this.queue[i+1].frequency) {
                    this.queue.splice(i + 1, 0, node);
                    break;
                }
                if (node.frequency <= this.queue[i].frequency && node.frequency >= this.queue[i - 1].frequency){
                    this.queue.splice(i, 0, node);
                    break;
                }
                if (node.frequency >= this.queue[i].frequency){
                    i = i + Math.floor((this.queue.length - i) / 2);
                }
                else if (node.frequency <= this.queue[i].frequency){
                    i = Math.floor(i / 2);
                }
            }
        }
        console.log(this.queue[this.queue.length - 1].symbol);
    };

    dequeue(){
        if(this.queue.length == 0){
            return("Is empty");
        }
        else{
            return(this.queue.shift());
        }
    };
}

class huffman_node{
    constructor(frequency, id, symbol = null, left = null, right = null, parent = null){
        this.frequency = frequency;
        this.id = id;
        this.symbol = symbol;
        this.parent = parent;
        this.left = left;
        this.right = right;
    };

    parentUpdate(parent){
        this.parent = parent;
    }
}

function readIn() {
    /* Step 1: Take text input from a file named "infile.dat" */
    var infile_path = prompt('Enter the path to your "infile.dat" to be loaded or nothing if "infile.dat" is in your current directory: ');

    if (infile_path === '')
        infile_path = './infile.dat';

    try {
        var infile = fs.readFileSync(infile_path, "utf8");
        //console.log(infile);
    }
    catch (error) {
        return("The file doesn't exist");
    }

    var frequencies = {};
    var letters = RegExp('[^A-Za-z]');
    for (var i of infile) {
        if (letters.test(i))
            continue;
        if (i in frequencies)
            frequencies[i] += 1;
        else
            frequencies[i] = 1;
    }

    var total_chars = 0;
    for (var key in frequencies) {
        total_chars += frequencies[key];
    }
    for (var key in frequencies) {
        frequencies[key] = (frequencies[key] / total_chars) * 100;
    }
    var items = Object.keys(frequencies).map(function(key) {
        return [frequencies[key], key];
    });
    return(items);
}
/* Step 2: Construct the frequency table according to the input text read from the file:
 * The frequency's must be listed, in order, from largest (at the top) to smallest (at the bottom) */

//Done ^^ Steps one and two

/* Step 3: Using the Huffman algorithm, construct the optimal prefix binary code for the table
 * The Huffman codes will be sorted in the same manner as the one above i.e. frequency, highest to lowest */


/* Step 4: Produce the output, in the file "outfile.dat", consisting of
 * 1) The frequency table for the source text
 * 2) The Huffman code for each letter and digit in the source code
 * 3) The length of the coded message in terms of the number of bits */

function genTree(){
    //generates a huffman tree
    var f = readIn();
    console.log(f);
    var q = new priorityQueue();
    for(var i = 0; i < f.length; i++){
        var node = new huffman_node(f[i][0],i,f[i][1]);
        console.log(node.symbol);
        q.enqueue(node);
    }

    var l = null;
    var r = null;
    var par = null;
    while(q.queue.length > 1){
        l = q.dequeue();
        r = q.dequeue();
        par = new huffman_node((l.frequency + r.frequency), i++, null, l, r);
        l.parentUpdate(par);
        r.parentUpdate(par);
        q.enqueue(par);
    }
    return q;
}

function genTable(htree){
    function genCodesHelper(node, huffCode){
        if (node.symbol != null) {
            return [[node.symbol, node.frequency, huffCode]];
        }
        else
            return genCodesHelper(node.left, huffCode + '0').concat(genCodesHelper(node.right, huffCode + '1'));
    }
    return genCodesHelper(htree.queue[0], '')
}

function output(list){
    var string = 'Symbol    Frequency   Huffman Codes\n';
    for (var i = 0; i < list.length; i++){
        var g = list[i][1].toFixed(2);
        string+= list[i][0] + '         ' + g +  ' '.repeat(12 - String(g).length) + list[i][2] + '\n';

    }
    fs.writeFile('outfile.dat', string, (err)=> {
        if (err) throw err;
        console.log('File saved!');
    })
}

function main() {
    var htree = genTree();
    console.log(htree);
    output(genTable(htree).sort());
}

main();

// Change priority Q To not be so horifically inefficient - I think I did that
// Traverse tree in order to obtain huffman codes
// Generate all tables for output file
// Fix read in function, if you enter garbage as the input it does some weird stuff
