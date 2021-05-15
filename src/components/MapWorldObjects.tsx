import * as S from './MapWorldObjects.styles';
import React from 'react';
import { ColyseusContext } from '../contexts/ColyseusContext';
import { useImmer } from 'use-immer';

export interface MapWorldObjectsProps {
  className?: string;
}

const MapWorldObjects: React.FC<MapWorldObjectsProps> = React.memo(
  function MapWorldObjects({ className }) {
    const { room: colyseusRoom } = React.useContext(ColyseusContext);
    const [worldObjects, setWorldObjects] = useImmer<{ [id: string]: any }>({});

    React.useEffect(() => {
      if (!colyseusRoom) {
        return;
      }

      colyseusRoom.state.worldObjects.onAdd = (
        worldObject: any,
        id: string
      ) => {
        setWorldObjects((draft) => {
          draft[id] = worldObject;
        });
      };

      colyseusRoom.state.worldObjects.onRemove = (
        worldObject: any,
        id: string
      ) => {
        setWorldObjects((draft) => {
          delete draft[id];
        });
      };
    }, [colyseusRoom]);

    return (
      <>
        {Object.entries(worldObjects).map(([id, worldObject]) => {
          if (worldObject.type === 'dot') {
            return (
              <S.Dot
                key={id}
                style={{
                  transform: `translate(${worldObject.x}px, ${worldObject.y}px)`,
                }}
              />
            );
          }
          return null;
        })}
      </>
    );
  }
);

export default MapWorldObjects;
