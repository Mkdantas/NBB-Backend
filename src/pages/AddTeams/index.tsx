import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonItem, IonLabel, IonButton, IonIcon } from '@ionic/react';
import fire from 'firebase';

import './styles.css';
import { arrowBack } from 'ionicons/icons';
import { Redirect } from 'react-router';



const AddTeams: React.FC = () => {
  const db = fire.firestore();

  const randomID = () => {
    return Math.random().toString(9).substr(2, 9);
  };
  //eslint-disable-next-line
  const [ID, setID] = useState(randomID());
  const [team, setTeam] = useState<string>();
  const [stadium, setStadium] = useState<string>();
  const [fileUrl, setFileUrl] = useState(null);
  const [validated, setValidated] =  useState(false);

  const onFileChange = async (e:any) =>{
    const file = e.target.files[0];
    const storageRef = fire.storage().ref();
    const fileRef = storageRef.child(file.name);
    await fileRef.put(file);
    setFileUrl(await fileRef.getDownloadURL());
  }

  const submitTeam = (e:any) =>{
    e.preventDefault();

    db.collection("teams").doc(ID).set({
      ID,
      name: team,
      stadium,
      logo: fileUrl
    }).then(() =>{
      setValidated(true);
    }).catch(function (error) {
      console.error("Error adding document: ", error);
    });
  }



  return (
    <IonPage className="add-team-page">
      {validated ? <Redirect to="/teams" /> : null}
      <IonHeader>
        <IonToolbar>
          <IonButton fill="clear" slot="start" routerDirection="back" routerLink="/teams">
            <IonIcon ios={arrowBack} md={arrowBack}/> 
          </IonButton>
          <IonTitle>Add a new Team</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <form onSubmit={submitTeam}>
          <IonItem>
            <IonLabel position="floating">Team Name:</IonLabel>
            <IonInput value={team} onIonChange={e => setTeam(e.detail.value!)}> </IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Team Stadium:</IonLabel>
            <IonInput value={stadium} onIonChange={e => setStadium(e.detail.value!)}> </IonInput>
          </IonItem>
          <div className="team-logo">
            <label>Team Logo:</label>
            <input type="file" onChange={onFileChange}/>
         </div>
         <div className="submit-button">
         <IonButton expand="block" type="submit" fill="solid">Send</IonButton>
         </div>
       </form>
      </IonContent>
    </IonPage>
  );
};

export default AddTeams;