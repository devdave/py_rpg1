import os
#shortcut aliases
ABP = os.path.abspath
J = os.path.join
DRN = os.path.dirname

HERE = lambda current_file, target_file: ABP(J(DRN(current_file), target_file))
