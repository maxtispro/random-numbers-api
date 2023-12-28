import sys, time, datetime
import cv2 as cv

def imgFeed(cam, delay):
  vc = cv.VideoCapture(cam)

  if vc.isOpened(): # try to get the first frame
    rval, frame = vc.read()
  else:
    rval = False

  m = 1
  while rval:
    time.sleep(delay / 1000)
    rval, frame = vc.read()
    cv.imwrite("include/img/img" + str(m) + ".png", frame)
    m = 1 if m >= 999 else m + 1
    key = cv.waitKey(20)
    if key == 27: # exit on ESC
      break


if __name__ == "__main__":
  if len(sys.argv) != 3:
    print("webcam.py: Must have one argument")
    exit()
  try:
    n = int(sys.argv[1])
    delay = int(sys.argv[2])
    if (n < 0 or delay < 0):
      print("webcam.py: Arguments can't be negative")
  except:
    print("webcam.py: Arguments must be a number")
  imgFeed(n, delay)