import { Link, useSearchParams } from "react-router-dom";


type ModalProps = {
    current: string,
    query: string,
    text: string,
    buttons: ({ text: string, target: string | null, callback: (()=>void) | null })[],
    forceRefresh?: boolean
}

function Modal(props: ModalProps) {
    const searchParams = useSearchParams();
    const modal = searchParams[0].has(props.query);
    return (
        <>
            {modal &&
                <dialog
                    className="fixed left-0 top-0 w-full h-full bg-night bg-opacity-10 text-night-text z-50 overflow-auto backdrop-blur flex justify-center items-center">
                    <div className="m-auto p-8">
                        <div className="flex flex-col items-center">
                            <p className="mb-4">{props.text}</p>
                            <div className="flex gap-4">
                            {props.buttons.map((b, i)=>{
                                return( (props.forceRefresh) ? 
                                    <Link reloadDocument key={i} className="btn" to={ (b.target === null) ? props.current : b.target } onClick={(b.callback === null)? ()=>{}: b.callback}>{b.text}</Link>:
                                    <Link key={i} className="btn" to={ (b.target === null) ? props.current : b.target } onClick={(b.callback === null)? ()=>{}: b.callback}>{b.text}</Link>
                                )
                            })}
                            </div>
                        </div>
                    </div>
                </dialog>
            }
        </>
    );
}

export default Modal;