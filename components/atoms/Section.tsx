import React, { FC, useRef } from 'react'
import { motion, useAnimation, useInView } from "framer-motion"
const Section: FC<{children:any}> = ({children}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <section ref={ref}>
            <div
                style={{
                    //transform: isInView ? "none" : "",
                    opacity: isInView ? 1 : 0,
                    transition: "all 0.3s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s"
                }}
            >
                {children}
            </div>
        </section>
    );
}

export default Section
