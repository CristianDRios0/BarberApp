// import { Servicio } from "@/models/Servicio";
// import { createContext, ReactNode } from "react";


// interface ServiceContextType {
//     servicios: Servicio[];
//     addServices: (service: Omit<Servicio, 'id'>) => Promise<void>;
//     updateServices: (id: string, updatedService: Partial<Servicio>) => Promise<void>;
//     deleteServices: (id: string) => Promise<void>;
// }

// const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

// export const ServiceProvider: ({ children}: {children: ReactNode}) => {

//     const [servicios, setServicios] = useState<Servicio[]>([]);

//     const addServices = async (new: Omit<Servicio, 'id'>) => {
//         try {
//             const response = await createService (new as Servicio);
//             setServicios()
            
//         }
//     }


// }