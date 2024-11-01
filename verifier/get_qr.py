import subprocess

def ping_extrimian():
    return subprocess.check_output("bash presentvc.sh", shell=True)