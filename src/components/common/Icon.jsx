import * as ai from "react-icons/ai";
import * as bs from "react-icons/bs";
import * as bi from "react-icons/bi";
import * as ci from "react-icons/ci";
import * as cg from "react-icons/cg";
import * as di from "react-icons/di";
import * as fi from "react-icons/fi";
import * as fc from "react-icons/fc";
import * as fa from "react-icons/fa";
import * as fa6 from "react-icons/fa6";
import * as gi from "react-icons/gi";
import * as go from "react-icons/go";
import * as gr from "react-icons/gr";
import * as hi from "react-icons/hi";
import * as hi2 from "react-icons/hi2";
import * as im from "react-icons/im";
import * as lia from "react-icons/lia";
import * as io from "react-icons/io";
import * as io5 from "react-icons/io5";
import * as lu from "react-icons/lu";
import * as md from "react-icons/md";
import * as pi from "react-icons/pi";
import * as rx from "react-icons/rx";
import * as ri from "react-icons/ri";
import * as si from "react-icons/si";
import * as sl from "react-icons/sl";
import * as tb from "react-icons/tb";
import * as tfi from "react-icons/tfi";
import * as ti from "react-icons/ti";
import * as vsc from "react-icons/vsc";
import * as wi from "react-icons/wi";
import { capitalize } from "lodash";

/* eslint-disable */
const icons = {
    ai, bs, bi, ci, vsc,
    di, fi, fc, fa, fa6,
    gi, go, gr, hi, hi2,
    im, io, si, lu, lia,
    md, pi, rx, ri, io5,
    sl, tb, ti, wi, tfi,
    cg
};
/* eslint-enable */

function Icon({ icon, asset, ...attrs }) {
    const word = capitalize(asset).replace(/[0-9]/g, "");
    const TargetComp = icons[asset][`${word}${icon}`];
    return (
        <>
            <TargetComp {...attrs} />
        </>
    );
}

export default Icon;
