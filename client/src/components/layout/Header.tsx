import logo from '../../assets/logo.png';
export default function Header(){
    return(
        <div className="flex w-full justify-center items-center">
            <img 
                src={logo}
                className="h-[100] w-[300]"
                height={100}
                width={300} 
                alt={"P-Quiz Logo"} />
        </div>
    );
}