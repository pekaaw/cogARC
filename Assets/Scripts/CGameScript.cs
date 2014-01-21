using UnityEngine;
using System.Collections;

public class CGameScript : MonoBehaviour {
	const int numberOfCubes = 9;
	static bool[] cubeStates = new bool[numberOfCubes] {false,false,false,false,false,false,false,false,false};
	// Use this for initialization
	void Start () {
		float cubeSize = 1.2f;
		float colliderSize = cubeSize + 0.1f;
		MarkerTracker markerTracker = (MarkerTracker)
			TrackerManager.Instance.GetTracker<MarkerTracker> ();
		int[] markerIds = new int[numberOfCubes] {10,27,114,273,42,213,99,13,81};
		int markerSize = 1;
		for (int i = 0; i < markerIds.Length; i++) {
			string markerName = "marker" + markerIds [i];  // unique name
			MarkerAbstractBehaviour markerBehaviour = markerTracker.CreateMarker
							(markerIds [i], markerName, markerSize);
		
			if (markerBehaviour != null) {
				// Add a trackable event handler
				markerBehaviour.gameObject.AddComponent<DefaultTrackableEventHandler> ();
			
				// Add an object as a child
				GameObject cube = GameObject.CreatePrimitive (PrimitiveType.Cube);
				cube.transform.parent = markerBehaviour.transform;
				cube.transform.localScale = new Vector3 (cubeSize, cubeSize, cubeSize);
				cube.transform.localPosition = new Vector3 (0.0f, -0.5f, 0.0f);


				Rigidbody centerOfGravity  = cube.AddComponent ("Rigidbody") as Rigidbody;
				centerOfGravity.useGravity = false;
				centerOfGravity.isKinematic = true;

				BoxCollider boxCensor;
				boxCensor = cube.AddComponent ("BoxCollider") as BoxCollider;
				boxCensor.size = new Vector3(colliderSize, colliderSize, colliderSize);
				boxCensor.isTrigger = true;
				cube.AddComponent("CubeScript");
			}
		}
	}
	// Update is called once per frame
	void Update () {
	
	}

	static public void PostStatusToGameState(int index, bool state){
		cubeStates [index] = state;
	}
}


