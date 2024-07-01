import { AgregarCategorias } from "./AgregarCategorias"
import { AgregarSubcategorias } from "./AgregarSubcategorias"

export const AgregarCategoriasYSubcategorias = () => {
    return (
        <div className="flex flex-col items-center w-[79%] h-full justify-center mq980:w-full">
            <AgregarCategorias></AgregarCategorias>
            <AgregarSubcategorias></AgregarSubcategorias>
            
        </div>
    )
}