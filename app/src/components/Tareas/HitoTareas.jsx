import TareaItem from './TareaItem';

const HitoTareas = ({ tareas = [], onToggle }) => {  const [tareas, setTareas] = useState(mockTareas);

  return (
    <div className="p-6"> 
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Tareas</h2>
        
        <div className="flex space-x-3 text-gray-400 items-center">
          <button className="text-2xl hover:text-orange-500 transition-colors transform -translate-y-[1px]">
            +
          </button>
          <button className="hover:text-orange-500 transition-colors">
            ☰
          </button>
        </div>
      </div>

      <div className="space-y-1">
                {tareas.length === 0 ? (
                    <p className="text-gray-500">No hay tareas asociadas a este hito.</p>
                ) : (
                    tareas.map(tarea => (
                        <TareaItem 
                            key={tarea.id} 
                            tarea={tarea} 
                            onToggle={onToggle} 
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default HitoTareas;