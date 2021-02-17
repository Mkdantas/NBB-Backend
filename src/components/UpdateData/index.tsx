import React, { useEffect, useState } from 'react';
import { IonContent, IonInput, IonItem, IonLabel, IonButton, IonSelect, IonSelectOption, IonDatetime, IonAvatar, IonToast } from '@ionic/react';
import fire from 'firebase';

import './styles.css';

interface updateInfo {
    type: string;
    updateID: string;
}

const UpdateData: React.FC<updateInfo> = ({type, updateID}) => {
  const db = fire.firestore();
  //eslint-disable-next-line
  const [ID, setID] = useState(updateID);
  const [team, setTeam] = useState<string>();
  const [stadium, setStadium] = useState<string>();
  const [fileUrl, setFileUrl] = useState();
  const [validated, setValidated] =  useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [homeTeam, setHomeTeam] = useState('');
  const [visitorTeam, setVisitorTeam] = useState('');
  const [teams, setTeams] = useState([{}]);
  const [updatingLogo, setUpdatingLogo] = useState(false);
  const [homeScore, setHomeScore] = useState(0);
  const [visitorScore, setVisitorScore] = useState(0);
  const [visitorTeamName, setVisitorTeamName] = useState<string>();
  const [homeTeamName, setHomeTeamName] = useState<string>();

  const onFileChange = async (e:any) =>{
    const file = e.target.files[0];
    const storageRef = fire.storage().ref();
    const fileRef = storageRef.child(file.name);
    await fileRef.put(file);
    setFileUrl(await fileRef.getDownloadURL());
  }

  const submitTeam = (e:any) =>{
    e.preventDefault();

    db.collection("teams").doc(ID).update({
      ID,
      name: team,
      stadium,
      logo: fileUrl
    }).then(() =>{
      setValidated(true);
    }).catch(function (error) {
      console.error("Error updating document: ", error);
    });
  }

  const fetchData = async () => {
    if(type === 'team'){
    await db.collection("teams").doc(ID).get().then((doc:any) =>{
      setTeam(doc.data().name);
      setStadium(doc.data().stadium);
      setFileUrl(doc.data().logo);
    });
  } else if(type === 'game'){
    await db.collection("games").doc(ID).get().then((doc:any) =>{
      setHomeTeam(doc.data().homeTeam);
      setVisitorTeam(doc.data().visitorTeam);
      setSelectedDate(doc.data().selectedDate);
      setVisitorScore(doc.data().visitorScore);
      setHomeScore(doc.data().homeScore);
      db.collection('teams').doc(doc.data().homeTeam).get().then((doc:any) =>{
        setHomeTeamName(doc.data().name);
      })
      db.collection('teams').doc(doc.data().visitorTeam).get().then((doc:any) =>{
        setVisitorTeamName(doc.data().name);
      })
    });
    const fetchedTeams = await db.collection("teams").get();
    setTeams(
      fetchedTeams.docs.map((doc: any) => {
        return doc.data();
      })
    );
  }
  };

  const setWinnerLoser = async (winner:any, loser:any, winnerScore:number, enemyScore:number) =>{
    await db.collection('ranking').doc(winner).get().then((rankings:any) =>{
      db.collection('ranking').doc(winner).update({
        wins: rankings.data().wins + 1,
        games: rankings.data().games + 1 ,
        teamPoints: rankings.data().teamPoints + winnerScore,
        enemyPoints: rankings.data().enemyPoints + enemyScore,
        totalPoints: (rankings.data().teamPoints + winnerScore) - (rankings.data().enemyPoints + enemyScore),
      })
    })  
    await db.collection('ranking').doc(loser).get().then((rankings:any) =>{
      db.collection('ranking').doc(loser).update({
        loss: rankings.data().loss + 1,
        games: rankings.data().games + 1,
        teamPoints: rankings.data().teamPoints + enemyScore,
        enemyPoints: rankings.data().enemyPoints + winnerScore,
        totalPoints: (rankings.data().teamPoints + enemyScore) - (rankings.data().enemyPoints + winnerScore),
      })
    })
  
  }

  const submitGame = async (e:any) =>{
    e.preventDefault();
    await db.collection("games").doc(ID).update({
      ID,
      homeTeam,
      visitorTeam,
      selectedDate,
      homeScore: Number(homeScore),
      visitorScore: Number(visitorScore)
    }).then(() =>{
      setValidated(true);
    }).catch(function (error) {
      console.error("Error adding document: ", error);
    });

    if(homeScore > visitorScore){
      await setWinnerLoser(homeTeam, visitorTeam, Number(homeScore), Number(visitorScore));
    } else if (visitorScore > homeScore){
      await setWinnerLoser(visitorTeam, homeTeam, Number(visitorScore), Number(homeScore));
    }
  }

  useEffect(() =>{
    fetchData();
     //eslint-disable-next-line
  }, []);
  
if(type === 'team') {
  return (
      <IonContent>
        <IonToast
        isOpen={validated}
        message="Team updated"
        duration={1000}
      />
         {validated ?  window.location.reload() : null}
        <form onSubmit={submitTeam}>
          <IonItem>
            <IonLabel position="floating">Team Name:</IonLabel>
            <IonInput value={team} onIonChange={e => setTeam(e.detail.value!)}> </IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Team Stadium:</IonLabel>
            <IonInput value={stadium} onIonChange={e => setStadium(e.detail.value!)}> </IonInput>
          </IonItem>
          {updatingLogo ? 
          <IonItem>
          <label>Team Logo:</label>
          <input type="file" onChange={onFileChange}/>
          </IonItem>:
          <IonItem onClick={() => setUpdatingLogo(true)}>
          Update Team Logo
            <IonAvatar slot="start">
            <img src={fileUrl} alt={`${team} logo`} />
            </IonAvatar>
          </IonItem>}
         <div className="submit-button">
         <IonButton expand="block" type="submit" fill="solid">Send</IonButton>
         </div>
       </form>
      </IonContent>
  );
} else if(type === 'game'){
  return(
      <IonContent>
        <IonToast
        isOpen={validated}
        message="Game updated"
        duration={1000}
      />
        {validated ?  window.location.reload() : null}
        <form onSubmit={submitGame}>
          <IonItem>
          <IonLabel position="fixed">Home Team: </IonLabel>
          <IonSelect value={homeTeam} onIonChange={ (e:any) => setHomeTeam(e.detail.value!)} placeholder={homeTeamName} >
              {teams.map((team:any) =>{
                return (
                  <IonSelectOption key={Math.random()} value={team.name}>{team.name}</IonSelectOption>
                )
              })}
            </IonSelect>
          </IonItem>
          <IonItem>
          <IonLabel position="fixed">Score: </IonLabel>
          <IonInput type="number" value={homeScore} maxlength={3} onIonChange={(e:any) => setHomeScore(e.detail.value!)} ></IonInput>
          </IonItem>
          <IonItem>
          <IonLabel position="fixed">Visitor Team: </IonLabel>
          <IonSelect value={visitorTeam} onIonChange={ (e:any) => setVisitorTeam(e.detail.value!)} placeholder={visitorTeamName}>
              {teams.map((team:any) =>{
                return (
                  <IonSelectOption key={Math.random()} value={team.name}>{team.name}</IonSelectOption>
                )
              })}
            </IonSelect>
          </IonItem>
          <IonItem>
          <IonLabel position="fixed">Score: </IonLabel>
          <IonInput type="number" value={visitorScore}  maxlength={3} onIonChange={(e:any) => setVisitorScore(e.detail.value!)} ></IonInput>
          </IonItem>
         <IonItem>
         <IonLabel position="floating">Date:</IonLabel>
         <IonDatetime displayFormat={"MMM DD, YYYY HH:mm"} placeholder="Select Date" value={selectedDate} onIonChange={e => setSelectedDate(e.detail.value!)}></IonDatetime>
         </IonItem>
         <div className="submit-button">
         <IonButton expand="block" type="submit" fill="solid">Send</IonButton>
         </div>
       </form>
      </IonContent>
  );
} else {
  return null;
}
};

export default UpdateData;