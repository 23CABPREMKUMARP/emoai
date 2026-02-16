import cv2
cap = cv2.VideoCapture(0)
if cap.isOpened():
    print("SUCCESS: Camera opened")
    ret, frame = cap.read()
    if ret:
        print("SUCCESS: Frame read")
    else:
        print("FAIL: Frame not read")
    cap.release()
else:
    print("FAIL: Camera not opened")
