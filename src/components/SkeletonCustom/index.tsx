import { IonAvatar, IonItem, IonLabel, IonList, IonSkeletonText } from '@ionic/react';
import React from 'react';

const SkeletonCustom = () =>{
    return (
        <>
        <IonList>
              <IonItem>
                <IonAvatar slot="start">
                  <IonSkeletonText animated />
                </IonAvatar>
                <IonLabel>
                  <h3>
                    <IonSkeletonText animated style={{ width: '50%' }} />
                  </h3>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonAvatar slot="start">
                  <IonSkeletonText animated />
                </IonAvatar>
                <IonLabel>
                  <h3>
                    <IonSkeletonText animated style={{ width: '50%' }} />
                  </h3>
                </IonLabel>
              </IonItem><IonItem>
                <IonAvatar slot="start">
                  <IonSkeletonText animated />
                </IonAvatar>
                <IonLabel>
                  <h3>
                    <IonSkeletonText animated style={{ width: '50%' }} />
                  </h3>
                </IonLabel>
              </IonItem><IonItem>
                <IonAvatar slot="start">
                  <IonSkeletonText animated />
                </IonAvatar>
                <IonLabel>
                  <h3>
                    <IonSkeletonText animated style={{ width: '50%' }} />
                  </h3>
                </IonLabel>
              </IonItem><IonItem>
                <IonAvatar slot="start">
                  <IonSkeletonText animated />
                </IonAvatar>
                <IonLabel>
                  <h3>
                    <IonSkeletonText animated style={{ width: '50%' }} />
                  </h3>
                </IonLabel>
              </IonItem><IonItem>
                <IonAvatar slot="start">
                  <IonSkeletonText animated />
                </IonAvatar>
                <IonLabel>
                  <h3>
                    <IonSkeletonText animated style={{ width: '50%' }} />
                  </h3>
                </IonLabel>
              </IonItem><IonItem>
                <IonAvatar slot="start">
                  <IonSkeletonText animated />
                </IonAvatar>
                <IonLabel>
                  <h3>
                    <IonSkeletonText animated style={{ width: '50%' }} />
                  </h3>
                </IonLabel>
              </IonItem><IonItem>
                <IonAvatar slot="start">
                  <IonSkeletonText animated />
                </IonAvatar>
                <IonLabel>
                  <h3>
                    <IonSkeletonText animated style={{ width: '50%' }} />
                  </h3>
                </IonLabel>
              </IonItem><IonItem>
                <IonAvatar slot="start">
                  <IonSkeletonText animated />
                </IonAvatar>
                <IonLabel>
                  <h3>
                    <IonSkeletonText animated style={{ width: '50%' }} />
                  </h3>
                </IonLabel>
              </IonItem><IonItem>
                <IonAvatar slot="start">
                  <IonSkeletonText animated />
                </IonAvatar>
                <IonLabel>
                  <h3>
                    <IonSkeletonText animated style={{ width: '50%' }} />
                  </h3>
                </IonLabel>
              </IonItem><IonItem>
                <IonAvatar slot="start">
                  <IonSkeletonText animated />
                </IonAvatar>
                <IonLabel>
                  <h3>
                    <IonSkeletonText animated style={{ width: '50%' }} />
                  </h3>
                </IonLabel>
              </IonItem>
            </IonList>
            </>
    )
}

export default SkeletonCustom;