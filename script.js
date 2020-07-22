// auto sliding conflicts with mousedown


class Carousel {
    constructor() {
        this.root = null;
        this.data = null;
    }

    render() {
        this.root = document.createElement('div');
        this.root.classList.add('carousel');

        for (let d of this.data) {
            let element = document.createElement('img');
            element.src = d;
            element.addEventListener('dragstart', event => event.preventDefault())
            this.root.appendChild(element)
        }

        let position = 0;

        let nextPic = () => {
            let nextPosition = (position + 1) % this.data.length;

            let current = this.root.childNodes[position];
            let next = this.root.childNodes[nextPosition];

            current.style.transition = "ease 0s";
            next.style.transition = "ease 0s";

            current.style.transform = `translateX(${- 100 * position}%)`;
            next.style.transform = `translateX(${100 - 100 * nextPosition}%)`;

            // request animation frame
            // requestAnimationFrame(function () {
            //     requestAnimationFrame(function () {
            //         current.style.transition = "ease 0.5s";
            //         next.style.transition = "ease 0.5s";

            //         current.style.transform = `translate(${-100 - 100 * position}%)`;
            //         next.style.transform = `translateX(${-100 * nextPosition}%)`;

            //         position = nextPosition;
            //     });
            // });

            setTimeout(function () {
                current.style.transition = ""; // "" means use css rule
                next.style.transition = "";

                current.style.transform = `translate(${-100 - 100 * position}%)`;
                next.style.transform = `translateX(${-100 * nextPosition}%)`;

                position = nextPosition;
            }, 16);

            setTimeout(nextPic, 3000);
        }

        this.root.addEventListener("mousedown", event => {
            document.addEventListener("selectstart", event => event.preventDefault())
            let [startX, startY] = [event.clientX, event.clientY];

            let prevPosition = (position - 1 + this.data.length) % this.data.length;
            let nextPosition = (position + 1) % this.data.length;

            let prev = this.root.childNodes[prevPosition];
            let current = this.root.childNodes[position];
            let next = this.root.childNodes[nextPosition];

            prev.style.transition = "ease 0s";
            current.style.transition = "ease 0s";
            next.style.transition = "ease 0s";

            // should use cssom to get the size
            prev.style.transform = `translateX(${-500 - 500 * prevPosition}px)`;
            current.style.transform = `translateX(${- 500 * position}px)`;
            next.style.transform = `translateX(${500 - 500 * nextPosition}px)`;

            let move = event => {
                prev.style.transform = `translateX(${event.clientX - startX - 500 - 500 * prevPosition}px)`;
                current.style.transform = `translateX(${event.clientX - startX - 500 * position}px)`;
                next.style.transform = `translateX(${event.clientX - startX + 500 - 500 * nextPosition}px)`;

                // console.log(event.clientX - startX, event.clientY - startY)
            }

            let up = event => {
                let offset = 0;

                if (event.clientX - startX > 250) {
                    offset = 1;
                } else if (event.clientX - startX < -250) {
                    offset = -1;
                }

                // open transition 
                prev.style.transition = "";
                current.style.transition = "";
                next.style.transition = "";

                prev.style.transform = `translateX(${offset * 500 - 500 - 500 * prevPosition}px)`;
                current.style.transform = `translateX(${offset * 500 - 500 * position}px)`;
                next.style.transform = `translateX(${offset * 500 + 500 - 500 * nextPosition}px)`;
                
                position = (position - offset + this.data.length) % this.data.length;

                document.removeEventListener("mousemove", move);
                document.removeEventListener("mouseup", up)
            }

            document.addEventListener("mousemove", move)
            document.addEventListener("mouseup", up)
        })
        // setTimeout(nextPic, 3000);
    }
}

// create
let carousel = new Carousel();

// update
carousel.data = [
    "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
    "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
    "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
    "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
];
carousel.render();

// mount
document.getElementById('container').appendChild(carousel.root);